import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VIDEO_SCRIPT_PROMPT, VideoScene } from "@/lib/prompts/video-scripts";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { topic } = body;

        if (!topic) {
            return NextResponse.json(
                { error: "Le topic est requis pour générer le script vidéo." },
                { status: 400 }
            );
        }

        const prompt = VIDEO_SCRIPT_PROMPT.replace("{{topic}}", topic);

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Extraire le JSON de la réponse Gemini
        const jsonMatch = text.match(/\\[[\\s\\S]*\\]/);

        if (!jsonMatch) {
            console.error("Failed to parse JSON script from Gemini output:", text);
            return NextResponse.json({ error: "L'IA n'a pas renvoyé un format de script valide." }, { status: 500 });
        }

        const scriptData: VideoScene[] = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
            success: true,
            topic: topic,
            script: scriptData
        });

    } catch (e) {
        console.error("Video Script Generation Error:", e);
        return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
}
