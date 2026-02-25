export interface ContentData {
  [key: string]: unknown;
}

const contentCache: Record<string, ContentData> = {};

export async function getContentData(filename: string): Promise<ContentData> {
  if (contentCache[filename]) {
    return contentCache[filename];
  }

  try {
    const response = await fetch(`/api/mdx-content/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    const data = await response.json();
    contentCache[filename] = data;
    return data as ContentData;
  } catch (error) {
    console.error(`Error loading content from ${filename}:`, error);
    return {};
  }
}
