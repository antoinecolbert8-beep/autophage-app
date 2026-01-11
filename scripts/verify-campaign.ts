import fetch from 'node-fetch';

async function main() {
    console.log("🧪 VERIFYING CAMPAIGN LAUNCH TOOL");
    console.log("=================================");

    // Payload asking for a campaign launch
    const payload = {
        messages: [
            {
                role: "user",
                content: "Lance une campagne immédiate sur le thème 'La fin du code' pour attirer des développeurs."
            }
        ],
        // The system should detect 'launch_campaign' tool usage
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
                const tool = data.tool_calls.find((t: any) => t.function.name === 'launch_campaign');
                if (tool) {
                    console.log("\n✅ SUCCESS: Agent called 'launch_campaign' tool!");
                    console.log("Arguments:", tool.function.arguments);
                } else {
                    console.log("\n⚠️ Agent called tools, but not launch_campaign:", data.tool_calls);
                }
            } else {
                console.log("\n⚠️ Agent replied with text (failed to use tool?):", data.content);
            }
        } else {
            console.log("\n❌ Unexpected response format.");
        }

    } catch (error) {
        console.error("\n❌ Request Failed:", error);
    }
}

main();
