import { google, type gmail_v1 } from "googleapis";
import { prisma } from "@/lib/db";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

const BATCH_SIZE = 20;
const INITIAL_SYNC_DAYS = 30;

// ---------------------------------------------------------------------------
// OAuth helpers
// ---------------------------------------------------------------------------

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL || "https://www.lx3.ai"}/api/growth-os/gmail/callback`
  );
}

export function getGmailAuthUrl(userId: string): string {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state: userId,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
}

// ---------------------------------------------------------------------------
// Gmail client with auto-refresh
// ---------------------------------------------------------------------------

async function getGmailClient(userId: string): Promise<{
  gmail: gmail_v1.Gmail;
  emailAddress: string;
} | null> {
  if (!prisma) return null;

  const account = await prisma.account.findFirst({
    where: { userId, provider: "google-gmail" },
  });

  if (!account?.access_token || !account?.refresh_token) return null;

  const client = getOAuth2Client();
  client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });

  // Auto-refresh if expired
  const now = Date.now();
  if (account.expires_at && account.expires_at * 1000 < now) {
    try {
      const { credentials } = await client.refreshAccessToken();
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: credentials.access_token,
          expires_at: credentials.expiry_date
            ? Math.floor(credentials.expiry_date / 1000)
            : undefined,
        },
      });
      client.setCredentials(credentials);
    } catch (error) {
      console.error("[Gmail Sync] Token refresh failed:", error);
      return null;
    }
  }

  const syncState = await prisma.gmailSyncState.findUnique({
    where: { userId },
  });

  const gmail = google.gmail({ version: "v1", auth: client });

  return {
    gmail,
    emailAddress: syncState?.emailAddress ?? account.providerAccountId,
  };
}

// ---------------------------------------------------------------------------
// Contact matching
// ---------------------------------------------------------------------------

async function matchContact(
  emailAddresses: string[]
): Promise<string | null> {
  if (!prisma || emailAddresses.length === 0) return null;

  const contact = await prisma.contact.findFirst({
    where: {
      email: {
        in: emailAddresses.map((e) => e.toLowerCase()),
      },
    },
    select: { id: true },
  });

  return contact?.id ?? null;
}

function extractEmail(headerValue: string): string[] {
  // Extract email addresses from header values like "Name <email@example.com>, other@example.com"
  const emails: string[] = [];
  const matches = headerValue.matchAll(/[\w.+-]+@[\w.-]+\.\w+/g);
  for (const match of matches) {
    emails.push(match[0].toLowerCase());
  }
  return emails;
}

function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string
): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

// ---------------------------------------------------------------------------
// Process a single Gmail message
// ---------------------------------------------------------------------------

async function processMessage(
  gmail: gmail_v1.Gmail,
  messageId: string,
  connectedEmail: string
) {
  if (!prisma) return;

  // Skip if already synced
  const existing = await prisma.gmailEmail.findUnique({
    where: { gmailId: messageId },
  });
  if (existing) return;

  try {
    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "metadata",
      metadataHeaders: ["From", "To", "Cc", "Subject", "Date"],
    });

    const headers = msg.data.payload?.headers;
    const from = getHeader(headers, "From");
    const to = getHeader(headers, "To");
    const cc = getHeader(headers, "Cc");
    const subject = getHeader(headers, "Subject");
    const snippet = msg.data.snippet ?? "";
    const threadId = msg.data.threadId ?? "";
    const internalDate = msg.data.internalDate
      ? new Date(parseInt(msg.data.internalDate))
      : new Date();

    const fromEmails = extractEmail(from);
    const toEmails = extractEmail(to);
    const ccEmails = extractEmail(cc);

    const connectedLower = connectedEmail.toLowerCase();
    const direction = fromEmails.includes(connectedLower)
      ? "OUTBOUND"
      : "INBOUND";

    // Match contact: for outbound, match recipients; for inbound, match sender
    const matchCandidates =
      direction === "OUTBOUND"
        ? [...toEmails, ...ccEmails]
        : fromEmails;
    const contactId = await matchContact(
      matchCandidates.filter((e) => e !== connectedLower)
    );

    await prisma.gmailEmail.create({
      data: {
        gmailId: messageId,
        threadId,
        from,
        to: toEmails,
        cc: ccEmails,
        subject,
        snippet,
        direction,
        receivedAt: internalDate,
        contactId,
      },
    });

    // Create activity if matched to a contact
    if (contactId) {
      await prisma.activity.create({
        data: {
          type: direction === "INBOUND" ? "EMAIL_RECEIVED" : "EMAIL_SENT",
          title:
            direction === "INBOUND"
              ? `Email recibido: ${subject}`
              : `Email enviado (Gmail): ${subject}`,
          contactId,
          metadata: { gmailEmailId: messageId, from, to: toEmails },
        },
      });
    }
  } catch (error) {
    console.error(`[Gmail Sync] Error processing message ${messageId}:`, error);
  }
}

// ---------------------------------------------------------------------------
// Initial sync (last N days)
// ---------------------------------------------------------------------------

export async function performInitialSync(userId: string): Promise<number> {
  const client = await getGmailClient(userId);
  if (!client) return 0;

  const { gmail, emailAddress } = client;
  const since = new Date();
  since.setDate(since.getDate() - INITIAL_SYNC_DAYS);
  const query = `newer_than:${INITIAL_SYNC_DAYS}d`;

  let synced = 0;
  let pageToken: string | undefined;

  do {
    const res = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 100,
      pageToken,
    });

    const messages = res.data.messages ?? [];

    // Process in batches
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((m) => processMessage(gmail, m.id!, emailAddress))
      );
      synced += batch.length;
    }

    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  // Update historyId
  if (prisma) {
    const profile = await gmail.users.getProfile({ userId: "me" });
    if (profile.data.historyId) {
      await prisma.gmailSyncState.update({
        where: { userId },
        data: {
          historyId: profile.data.historyId,
          lastSyncAt: new Date(),
        },
      });
    }
  }

  return synced;
}

// ---------------------------------------------------------------------------
// Incremental sync (using historyId)
// ---------------------------------------------------------------------------

export async function performIncrementalSync(
  userId: string
): Promise<number> {
  if (!prisma) return 0;

  const syncState = await prisma.gmailSyncState.findUnique({
    where: { userId },
  });
  if (!syncState) return 0;

  const client = await getGmailClient(userId);
  if (!client) return 0;

  const { gmail, emailAddress } = client;
  let synced = 0;

  try {
    let pageToken: string | undefined;
    const messageIds = new Set<string>();

    do {
      const res = await gmail.users.history.list({
        userId: "me",
        startHistoryId: syncState.historyId,
        historyTypes: ["messageAdded"],
        pageToken,
      });

      for (const history of res.data.history ?? []) {
        for (const added of history.messagesAdded ?? []) {
          if (added.message?.id) {
            messageIds.add(added.message.id);
          }
        }
      }

      pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);

    // Process new messages
    const ids = Array.from(messageIds);
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map((id) => processMessage(gmail, id, emailAddress))
      );
      synced += batch.length;
    }

    // Update historyId
    const profile = await gmail.users.getProfile({ userId: "me" });
    if (profile.data.historyId) {
      await prisma.gmailSyncState.update({
        where: { userId },
        data: {
          historyId: profile.data.historyId,
          lastSyncAt: new Date(),
        },
      });
    }
  } catch (error: any) {
    // 404 means historyId is too old — do a partial re-sync
    if (error?.code === 404 || error?.status === 404) {
      console.warn("[Gmail Sync] historyId expired, doing partial re-sync");
      return performInitialSync(userId);
    }
    throw error;
  }

  return synced;
}
