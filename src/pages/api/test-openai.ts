import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ message: 'OpenAI API key is not set' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, OpenAI!" }],
      max_tokens: 50,
    });

    res.status(200).json({ result: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while testing the OpenAI API' });
  }
}
