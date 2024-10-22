import fs from 'fs/promises';
import path from 'path';

const LIKED_HEADLINES_FILE = path.join(process.cwd(), 'liked-headlines.json');

export async function getLikedHeadlines(): Promise<string[]> {
  try {
    const data = await fs.readFile(LIKED_HEADLINES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function saveLikedHeadline(headline: string): Promise<void> {
  const likedHeadlines = await getLikedHeadlines();
  if (!likedHeadlines.includes(headline)) {
    likedHeadlines.push(headline);
    await fs.writeFile(LIKED_HEADLINES_FILE, JSON.stringify(likedHeadlines, null, 2));
  }
}

export async function removeLikedHeadline(headline: string): Promise<void> {
  const likedHeadlines = await getLikedHeadlines();
  const updatedHeadlines = likedHeadlines.filter((h) => h !== headline);
  await fs.writeFile(LIKED_HEADLINES_FILE, JSON.stringify(updatedHeadlines, null, 2));
}
