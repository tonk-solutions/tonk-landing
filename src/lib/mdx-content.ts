import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface ContentFrontmatter {
  [key: string]: unknown;
}

export async function getFrontmatterOnly(
  filename: string,
): Promise<ContentFrontmatter | null> {
  try {
    const filePath = path.join(contentDir, `${filename}.md`);

    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContents);

    return data as ContentFrontmatter;
  } catch (error) {
    console.error(`Error loading frontmatter from ${filename}:`, error);
    return null;
  }
}
