import { GoogleGenAI } from "@google/genai";
export class GeminiService {
    public ai;
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
    }
}