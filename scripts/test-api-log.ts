async function test() {
    console.log("🧪 Testing API Log & AI Payout Loop...");
    const payload = {
        userId: "usr_admin_genesis_2026",
        platform: "LINKEDIN",
        action: "TEST_LIVE_FLUX",
        targetId: "test_target",
        context: { info: "manually triggered test" }
    };

    const resp = await fetch('http://localhost:3000/api/action-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await resp.json();
    console.log("Result:", data);
}

test();
