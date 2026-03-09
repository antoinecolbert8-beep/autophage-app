const fetch = require('node-fetch');

async function testAuth() {
    const url = 'https://teal-dolphin-3e5ce9.netlify.app/api/auth/callback/credentials';
    console.log(`Testing POST ${url}`);

    const formData = new URLSearchParams();
    formData.append('email', 'testuser2024@ela.ai');
    formData.append('password', 'Password123!');
    formData.append('redirect', 'false');

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Node-Fetch',
                'Cookie': 'next-auth.csrf-token=dummy',
            }
        });

        const status = res.status;
        const body = await res.text();
        console.log(`Status: ${status}`);
        console.log(`Response: ${body}`);
    } catch (err) {
        console.error('Error:', err);
    }
}

testAuth();
