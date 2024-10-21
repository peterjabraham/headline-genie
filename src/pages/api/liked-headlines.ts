import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'liked-headlines.json');

interface LikedHeadline {
  headline: string;
  primaryText: string;
  timestamp: string;
}

function getLikedHeadlines(): LikedHeadline[] {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

function saveLikedHeadlines(headlines: LikedHeadline[]) {
  fs.writeFileSync(dbPath, JSON.stringify(headlines, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const likedHeadlines = getLikedHeadlines();
    res.status(200).json(likedHeadlines);
  } else if (req.method === 'POST') {
    const { headline, primaryText } = req.body;
    const likedHeadlines = getLikedHeadlines();
    const newHeadline: LikedHeadline = {
      headline,
      primaryText,
      timestamp: new Date().toISOString(),
    };
    likedHeadlines.push(newHeadline);
    saveLikedHeadlines(likedHeadlines);
    res.status(200).json({ message: 'Headline saved successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
