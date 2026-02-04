
import { generateText } from '@/lib/ai/vertex';
import * as dotenv from 'dotenv';
dotenv.config();

async function testVertex() {
    console.log("🧪 TESTING VERTEX AI DIRECTLY");

    // Explicitly print keys (partially masked)
    const key = process.env.VERTEX_AI_API_KEY || process.env.GOOGLE_API_KEY;
    console.log(`🔑 Key present: ${!!key} (Length: ${key?.length})`);

    const prompt = "Hello, are you working?";
    console.log(`📤 Sending prompt: "${prompt}"`);

    // List of models to try
    const models = ['gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash'];

    for (const modelName of models) {
        console.log(`\n🤖 Testing Model: ${modelName}`);
        try {
            const genAI = new (require('@google/generative-ai').GoogleGenerativeAI)(key);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = result.response.text();
            console.log(`✅ SUCCESS with ${modelName}! Response: "${response}"`);
            break; // Stop if success
        } catch (e: any) {
            console.error(`❌ FAILED with ${modelName}:`);
            console.error(e.message || e);
            require('fs').writeFileSync('error-log.txt', JSON.stringify(e, null, 2));
            if (e.response) console.error("Data:", JSON.stringify(e.response.data));
        }
    }
}

testVertex();
