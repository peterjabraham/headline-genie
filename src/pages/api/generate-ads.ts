import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const dbPath = path.join(process.cwd(), 'liked-headlines.json');

function getLikedHeadlines() {
  if (!fs.existsSync(dbPath)) {
    return [];
  }
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { brandName, product, userBenefit, promotion, audience, goal, keywords, additionalRules, csvData } = req.body;

  if (!brandName && !product && !userBenefit && !promotion && !audience && !goal && !keywords && !csvData) {
    return res.status(400).json({ message: 'At least one field is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OpenAI API key is not set' });
  }

  try {
    const likedHeadlines = getLikedHeadlines();
    const likedHeadlinesPrompt = likedHeadlines.length > 0
      ? `Previously liked headlines for reference:\n${likedHeadlines.map(h => `- ${h.headline}`).join('\n')}\n\n`
      : '';

    const prompt = `${likedHeadlinesPrompt}Generate 5 ad headlines and primary text for the following:
    Brand: ${brandName}
    Product: ${product}
    User Benefit: ${userBenefit}
    Promotion: ${promotion}
    Target Audience: ${audience}
    Goal: ${goal}
    Keywords: ${keywords}
    Additional Rules and Exclusions: ${additionalRules}
    CSV Data: ${csvData}

    Format the response as JSON with the following structure:
    {
      "ads": [
        {
          "headline": "Headline text here",
          "primaryText": "Primary text here"
        },
        // ... (4 more similar objects)
      ]
    }
    
    Important: Do not include any markdown formatting in your response. Return only the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Changed from "gpt-4-turbo" as it might not be available
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const result = completion.choices[0].message.content;
    
    // Remove any potential markdown formatting
    const cleanedResult = result?.replace(/```json\n?|\n?```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedResult || '{"ads": []}');
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw API response:', result);
      return res.status(500).json({ message: 'Error parsing API response' });
    }

    res.status(200).json(parsedResult);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while generating the ads' });
  }
}
