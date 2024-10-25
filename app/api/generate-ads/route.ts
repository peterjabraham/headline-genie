import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      likedHeadlines,
    } = body;

    // Construct the prompt for OpenAI
    let prompt = `Generate 5 compelling ad headlines and primary text for ${brandName}'s ${product}.\n\n`;
    prompt += `Key Benefits: ${userBenefit}\n`;
    prompt += promotion ? `Promotion: ${promotion}\n` : "";
    prompt += audience ? `Target Audience: ${audience}\n` : "";
    prompt += goal ? `Campaign Goal: ${goal}\n` : "";
    prompt += keywords ? `Keywords to Include: ${keywords}\n` : "";
    prompt += additionalRules ? `Additional Rules: ${additionalRules}\n` : "";

    if (useLikedHeadlines && likedHeadlines?.length > 0) {
      prompt += "\nInspired by these successful headlines:\n";
      likedHeadlines.forEach((headline: string) => {
        prompt += `- ${headline}\n`;
      });
    }

    if (csvData) {
      prompt += "\nReference these successful ads:\n";
      prompt += csvData;
    }

    prompt +=
      "\nFormat each ad as:\nHeadline: [headline text]\nPrimary Text: [primary text]";

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert ad copywriter who creates compelling, conversion-focused ad content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response to extract headlines and primary text
    const content = completion.choices[0].message.content;

    if (!content) {
      return NextResponse.json(
        { error: "Failed to generate ads" },
        { status: 500 },
      );
    }

    const ads = content
      .split("\n\n")
      .filter((ad) => ad.trim())
      .map((adBlock) => {
        const headlines = adBlock.match(/Headline: (.+)/);
        const primaryText = adBlock.match(/Primary Text: (.+)/);
        return {
          headline: headlines ? headlines[1] : "",
          primaryText: primaryText ? primaryText[1] : "",
        };
      });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error generating ads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
