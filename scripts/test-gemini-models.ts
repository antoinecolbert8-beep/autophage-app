import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

async function test() {
    const models = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.0-pro",
        "models/gemini-1.5-flash",
        "models/gemini-pro"
    ];

    for (const m of models) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hello");
            console.log(`✅ ${m} works!`);
            process.exit(0);
        } catch (e: any) {
            console.log(`❌ ${m} failed: ${e.message}`);
        }
    }
}

test();
