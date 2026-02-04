
// scripts/test-vertex-cloud.ts
import { VertexAI } from '@google-cloud/vertexai';
import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = 'us-central1'; // Default

    console.log(`☁️ Testing @google-cloud/vertexai for Project: ${projectId}`);

    // Note: This SDK prioritizes GOOGLE_APPLICATION_CREDENTIALS or gcloud auth.
    // It does NOT native support 'apiKey' in constructor usually.
    // But let's try.

    try {
        const vertexAI = new VertexAI({ project: projectId, location: location });
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.0-pro-001' });

        const resp = await model.generateContent('Hello world');
        console.log('✅ Response:', JSON.stringify(resp.response));
    } catch (e: any) {
        console.error('❌ Cloud SDK Error:', e.message);
        // console.error(e);
    }
}

main();
