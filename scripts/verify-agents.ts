import fetch from 'node-fetch';

async function main() {
    console.log("🧪 VERIFYING AGENT TOOL EXECUTION");
    console.log("================================");

    // Payload asking for a specific agent execution
    const payload = {
        messages: [
            {
                role: "user",
                content: "Analyze the crypto market immediately using your tools."
            }
        ],
        agent: "atlas" // Atlas should map to Opportunist or be handled
    };

    try {
        console.log("Sending request to /api/chat...");
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("\nRAW RESPONSE:", JSON.stringify(data, null, 2));

        if (data.role === 'assistant') {
            if (data.tool_calls) {
                console.log("\n✅ SUCCESS: Agent attempted to call a tool!");
                console.log("Tool Calls:", data.tool_calls);
            } else if (data.content && data.content.includes("mock")) {
                console.log("\n⚠️ WARNING: Agent returned mock content (API Key missing?)");
            } else {
                // If we implemented the second hop, we might just get text content "I have analyzed..."
                // We should check if the server logs showed Swarm execution.
                console.log("\nℹ️ RESPONSE CONTENT:", data.content);
            }
        } else {
            console.log("\n❌ Unexpected response format.");
        }

    } catch (error) {
        console.error("\n❌ Request Failed:", error);
    }
}

main();
