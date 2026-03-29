import { prisma } from "@/lib/db";

export async function generateQuoteNumber(): Promise<string> {
  if (!prisma) {
    throw new Error("Database connection not available");
  }

  const year = new Date().getFullYear();
  const prefix = `LX3-${year}-`;

  const lastQuote = await prisma.quote.findFirst({
    where: {
      quoteNumber: {
        startsWith: prefix,
      },
    },
    orderBy: {
      quoteNumber: "desc",
    },
    select: {
      quoteNumber: true,
    },
  });

  let nextNumber = 1;

  if (lastQuote) {
    const lastSequence = parseInt(lastQuote.quoteNumber.slice(prefix.length), 10);
    if (!isNaN(lastSequence)) {
      nextNumber = lastSequence + 1;
    }
  }

  return `${prefix}${nextNumber.toString().padStart(3, "0")}`;
}
