import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { budgetRecommendationPrompt } from "@/lib/prompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { monthlyIncome, spending } = body;

    if (!monthlyIncome || !spending) {
      return NextResponse.json(
        { error: "Monthly income and spending data are required" },
        { status: 400 }
      );
    }

    const prompt = budgetRecommendationPrompt({ monthlyIncome, spending });

    const ai =  new GoogleGenAI({
        apiKey : process.env.GEMINI_API_KEY
    });

    const result = await ai.models.generateContent({
        model : "gemini-3-flash-preview",
        contents : prompt
    })

    const text = result.text

    // clean markdown if Gemini wraps response in ```json
    const clean = text?.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean!);

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}