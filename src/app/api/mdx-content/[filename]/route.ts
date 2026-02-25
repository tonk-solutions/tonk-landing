import { getFrontmatterOnly } from "@/lib/mdx-content";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export async function generateStaticParams() {
  try {
    const files = fs.readdirSync(contentDir);
    return files
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        filename: file.replace(".md", ""),
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  try {
    const { filename } = await params;
    const frontmatter = await getFrontmatterOnly(filename);

    if (!frontmatter) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(frontmatter);
  } catch (error) {
    console.error(`Error loading content:`, error);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 },
    );
  }
}
