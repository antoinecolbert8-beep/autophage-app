import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

let botProcess: any = null;
let botStatus = 'stopped'; // 'stopped', 'running', 'error'

export async function GET() {
    return NextResponse.json({ status: botStatus, processId: botProcess ? botProcess.pid : null });
}

export async function POST(req: Request) {
    try {
        const { action } = await req.json();

        if (action === 'start') {
            if (botStatus === 'running') {
                return NextResponse.json({ success: false, message: 'Bot is already running', status: botStatus });
            }

            const botPath = path.join(process.cwd(), 'SaaS_Bot_LinkedIn', 'engagement_bot.py');
            const botDir = path.join(process.cwd(), 'SaaS_Bot_LinkedIn');

            botProcess = spawn('python', [botPath], { cwd: botDir });
            botStatus = 'running';

            botProcess.stdout.on('data', (data: any) => {
                console.log(`[LinkedIn Bot] ${data}`);
            });

            botProcess.stderr.on('data', (data: any) => {
                console.error(`[LinkedIn Bot Error] ${data}`);
            });

            botProcess.on('close', (code: any) => {
                console.log(`[LinkedIn Bot] Process exited with code ${code}`);
                botStatus = 'stopped';
                botProcess = null;
            });

            return NextResponse.json({ success: true, message: 'Bot started successfully', status: botStatus });
        }

        if (action === 'stop') {
            if (botStatus === 'stopped' || !botProcess) {
                return NextResponse.json({ success: false, message: 'Bot is not running', status: botStatus });
            }

            // Simple kill for now. On Windows, you might need a stronger kill depending on nested child processes.
            botProcess.kill('SIGTERM');
            botStatus = 'stopped';
            botProcess = null;

            return NextResponse.json({ success: true, message: 'Bot stopped successfully', status: botStatus });
        }

        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error("Error in Bot API:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
