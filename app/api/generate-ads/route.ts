import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth-options';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
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
    } = body;

    // Your existing OpenAI call logic here
    // ...

    return NextResponse.json({ ads: generatedAds });
  } catch (error) {
    console.error('Error generating ads:', error);
    return NextResponse.json(
      { error: 'Failed to generate ads' },
      { status: 500 }
    );
  }
}
