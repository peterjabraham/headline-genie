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

  const { 
    brandName, 
    product, 
    userBenefit, 
    promotion, 
    audience, 
    goal, 
    keywords, 
    additionalRules, 
    csvData,
    useLikedHeadlines,
    likedHeadlines 
  } = req.body;

  if (!brandName && !product && !userBenefit && !promotion && !audience && !goal && !keywords && !csvData) {
    return res.status(400).json({ message: 'At least one field is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OpenAI API key is not set' });
  }

  try {
    let likedHeadlinesPrompt = '';
    if (useLikedHeadlines && likedHeadlines && likedHeadlines.length > 0) {
      likedHeadlinesPrompt = `Previously liked headlines for reference:\n${likedHeadlines.map((h: any) => `- ${h.headline}`).join('\n')}\n\n`;
    }

    const prompt = `You have a deep understanding of the writing techniques of advertising legends like David Ogilvy, Dave Trott, Bill Bernbach, and Joseph Sugarman. Your ad text should be engaging and actionable.

    ${likedHeadlinesPrompt}Generate 5 ad headlines and primary text for the following:
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
          "headline": "Headline text here (max 40 characters)",
          "primaryText": "Primary text here (max 125 characters)"
        },
        // ... (4 more similar objects)
      ]
    }
    
    Important:
    1. Do not include any markdown formatting in your response. Return only the JSON object.
    2. Ensure that each headline is no more than 40 characters long.
    3. Ensure that each primary text is no more than 125 characters long.
    4. If a generated headline or primary text exceeds the character limit, truncate it to fit within the limit.
    5. Apply the engaging and actionable writing techniques of advertising legends in your generated content.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    const result = completion.choices[0].message.content;
    
    // Remove any potential markdown formatting
    const cleanedResult = result?.replace(/```json\n?|\n?```/g, '').trim();
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanedResult || '{"ads": []}');
      // Ensure character limits are enforced
      parsedResult.ads = parsedResult.ads.map((ad: any) => ({
        headline: ad.headline.slice(0, 40),
        primaryText: ad.primaryText.slice(0, 125)
      }));
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
