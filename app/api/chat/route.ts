import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SwarmOrchestrator } from '@/lib/agents/swarm-orchestrator';
import { generateText } from '@/lib/ai/vertex';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key-placeholder',
});

// Initialize Swarm (Singleton-like for this route)
const swarm = new SwarmOrchestrator();

// Define Tools
const tools = [
    {
        type: "function",
        function: {
            name: "run_specific_agent",
            description: "Execute a specific autonomous agent to perform its designated task immediately.",
            parameters: {
                type: "object",
                properties: {
                    agentName: {
                        type: "string",
                        enum: ["treasurer", "opportunist", "manager", "creator", "atlas", "nexus", "pulse", "vox", "hive", "apex"],
                        description: "The ID of the agent to run."
                    }
                },
                required: ["agentName"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "run_swarm_cycle",
            description: "Trigger a full synchronization cycle for all agents in the swarm.",
            parameters: {
                type: "object",
                properties: {},
            }
        }
    },
    {
        type: "function",
        function: {
            name: "launch_campaign",
            description: "Launch a targeted marketing campaign on a specific topic immediately. Use this when the user explicitly asks to start a campaign.",
            parameters: {
                type: "object",
                properties: {
                    topic: {
                        type: "string",
                        description: "The main topic or keyword of the campaign (e.g. 'AI Automation', 'Black Friday Sale')"
                    }
                },
                required: ["topic"]
            }
        }
    }
];

import { NeuroLinguisticArchitect } from '@/lib/neuro_architect';

export async function POST(req: Request) {
    try {
        const { messages, agent, system_prompt } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                role: 'assistant',
                content: "⚠️ Clé API manquante. Impossible d'exécuter des actions réelles."
            });
        }

        // PERSONA DEFINITIONS
        const personas: Record<string, string> = {
            "atlas": "You are ATLAS, the Market Intelligence Agent. Analyze data and use tools to fetch real stats.",
            "nexus": "You are NEXUS, the Strategist. Orchestrate the swarm and optimize workflows.",
            "pulse": "You are PULSE, the Trend Forecaster. Detect viral signals.",
            "vox": "You are VOX, the Communication Core. Handle messaging.",
            "hive": "You are HIVE, the Social Swarm. Manage distribution.",
            "apex": "You are APEX, the Performance Max. Focus on ROI and execution."
        };

        let basePrompt = personas[agent?.toLowerCase()] ||
            system_prompt ||
            "You are GENESIS. You have access to real-time tools. ALWAYS use them when asked to perform an action (like 'launch analysis', 'start agents'). Do not simulate.";

        // --- NEURO-LINGUISTIC ARCHITECTURE INJECTION ---
        // 1. Analyze user spectrum from last message
        const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || "";
        const neuroProfile = await NeuroLinguisticArchitect.analyzeSpectrum([lastUserMessage]);

        // 2. Generate Calibration Instructions
        const architectInstructions = NeuroLinguisticArchitect.generateSystemPrompt(neuroProfile);

        // 3. Fuse with Base Persona
        const selectedSystemPrompt = `${basePrompt}\n\n${architectInstructions}`;

        // 1. First Call to LLM
        // We use a custom call here because we need tool_calls, but we should handle failure
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: selectedSystemPrompt },
                    ...messages
                ],
                tools: tools as any,
                tool_choice: "auto",
            });
        } catch (e: any) {
            console.warn("⚠️ OpenAI failed in chat route, falling back to basic content generation via Vertex...");
            // Fallback: If OpenAI fails (401 etc), we use our unified generateText helper
            // Note: tool_calls won't work with basic generateText yet, but we provide a response
            const fallbackContent = await generateText(`System: ${selectedSystemPrompt}\n\nUser: ${lastUserMessage}`);
            return NextResponse.json({ role: 'assistant', content: fallbackContent });
        }

        const responseMessage = completion.choices[0].message;

        // 2. Check for Tool Calls
        if (responseMessage.tool_calls) {
            const toolCalls = responseMessage.tool_calls;
            // Append assistant's "thought" (function call request) to history
            const historyWithToolCall = [
                { role: "system", content: selectedSystemPrompt },
                ...messages,
                responseMessage
            ];

            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);
                let functionResponse;

                try {
                    if (functionName === "run_specific_agent") {
                        // Map chat agent names to swarm agent names if needed or execute directly
                        // Note: SwarmOrchestrator keys are: treasurer, opportunist, manager, creator
                        // We might need to map 'atlas' -> 'opportunist' etc. depending on architecture.
                        // For now, let's assume direct mapping or fallback.
                        // Valid swarm agents: treasurer, opportunist, manager, creator
                        const map: Record<string, string> = {
                            'atlas': 'opportunist', // Market intel
                            'nexus': 'manager',      // Strategy
                            'apex': 'treasurer',     // Finance/ROI
                            'creator': 'creator'
                        };
                        const target = map[functionArgs.agentName] || functionArgs.agentName;

                        // Check if valid valid swarm agent
                        if (['treasurer', 'opportunist', 'manager', 'creator'].includes(target)) {
                            const result = await swarm.runAgent(target as any);
                            functionResponse = JSON.stringify({ success: true, agent: target, output: result });
                        } else {
                            functionResponse = JSON.stringify({ success: false, error: `Agent '${target}' capability not linked to Swarm yet.` });
                        }

                    } else if (functionName === "run_swarm_cycle") {
                        const result = await swarm.runAll();
                        functionResponse = JSON.stringify({ success: true, output: result });

                    } else if (functionName === "launch_campaign") {
                        const result = await swarm.launchCampaign(functionArgs.topic);
                        functionResponse = JSON.stringify({ success: true, output: result });
                    }
                } catch (e: any) {
                    functionResponse = JSON.stringify({ success: false, error: e.message });
                }

                // Append tool output to history
                historyWithToolCall.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: functionResponse,
                });
            }

            // 3. Second Call to LLM to summarize execution
            const secondResponse = await openai.chat.completions.create({
                model: "gpt-4-turbo-preview",
                messages: historyWithToolCall as any,
            });

            return NextResponse.json(secondResponse.choices[0].message);
        }

        // No tool called, return normal text
        return NextResponse.json(responseMessage);

    } catch (error: any) {
        console.error("OpenAI/Swarm Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
