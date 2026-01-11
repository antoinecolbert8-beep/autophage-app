import { NextResponse } from 'next/server';
import { publisherWorker } from '@/lib/workers/publisher';
import { SwarmOrchestrator } from '@/lib/agents/swarm-orchestrator';

export const dynamic = 'force-dynamic'; // Ensure it runs every time

export async function GET(request: Request) {
    // Basic security check (Verify Vercel Cron header in real prod)
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return new Response('Unauthorized', { status: 401 }); }

    console.log("⏰ [Cron] Starting scheduled tasks...");

    try {
        // 1. Run Publisher (Send scheduled posts)
        await publisherWorker.processScheduledPosts();

        // 2. Run Sales Agent (Prospecting) - Limited cycle
        const swarm = new SwarmOrchestrator();
        await swarm.runAgent("sales");

        return NextResponse.json({ success: true, message: "Tasks executed" });
    } catch (error) {
        console.error("❌ [Cron] Execution Error:", error);
        return NextResponse.json({ success: false, error: "Task failed" }, { status: 500 });
    }
}
