import fs from "node:fs";
import path from "node:path";

interface BlogMarkdownFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  featured: boolean;
  ogImage?: string;
}

interface BlogArticleInput {
  slug: string;
  category: string;
  date: string;
  readTime: number;
  readingTime: string;
  author: string;
  tags: string[];
  featured: boolean;
  title: string;
  description: string;
  content: string;
  ogImage?: string;
}

const BLOG_POSTS_DIR = path.join(process.cwd(), "content", "blog-posts");
const REQUIRED_FRONTMATTER_KEYS = [
  "title",
  "slug",
  "description",
  "date",
  "author",
  "category",
  "tags",
  "readingTime",
  "featured",
] as const;

function parseFrontmatterValue(rawValue: string) {
  const value = rawValue.trim();

  if (value === "true") return true;
  if (value === "false") return false;
  if (value.startsWith('"') || value.startsWith("[") || value.startsWith("{")) {
    return JSON.parse(value);
  }

  return value;
}

function parseFrontmatter(fileContent: string): {
  frontmatter: BlogMarkdownFrontmatter;
  content: string;
} {
  const match = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Markdown post is missing frontmatter block.");
  }

  const [, rawFrontmatter, markdownContent] = match;
  const frontmatter: Record<string, unknown> = {};

  for (const line of rawFrontmatter.split("\n")) {
    if (!line.trim()) continue;
    const separatorIndex = line.indexOf(":");
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    frontmatter[key] = parseFrontmatterValue(value);
  }

  for (const key of REQUIRED_FRONTMATTER_KEYS) {
    if (frontmatter[key] === undefined) {
      throw new Error(`Markdown post is missing required frontmatter key: ${key}`);
    }
  }

  return {
    frontmatter: frontmatter as unknown as BlogMarkdownFrontmatter,
    content: markdownContent.trim(),
  };
}

function buildArticle(input: BlogArticleInput) {
  return {
    slug: input.slug,
    category: input.category,
    date: input.date,
    readTime: input.readTime,
    readingTime: input.readingTime,
    author: input.author,
    tags: input.tags,
    featured: input.featured,
    title: { es: input.title, en: input.title },
    excerpt: { es: input.description, en: input.description },
    description: { es: input.description, en: input.description },
    content: { es: input.content, en: input.content },
    ogImage: input.ogImage,
  };
}

export function loadMarkdownArticles() {
  if (!fs.existsSync(BLOG_POSTS_DIR)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(BLOG_POSTS_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .sort();

  return fileNames.map((fileName) => {
    const filePath = path.join(BLOG_POSTS_DIR, fileName);
    const rawFile = fs.readFileSync(filePath, "utf8");
    const { frontmatter, content } = parseFrontmatter(rawFile);
    const readTime = Number.parseInt(frontmatter.readingTime, 10) || 1;

    return buildArticle({
      slug: frontmatter.slug,
      category: frontmatter.category,
      date: frontmatter.date,
      readTime,
      readingTime: frontmatter.readingTime,
      author: frontmatter.author,
      tags: frontmatter.tags,
      featured: frontmatter.featured,
      title: frontmatter.title,
      description: frontmatter.description,
      content,
      ogImage: frontmatter.ogImage,
    });
  });
}
