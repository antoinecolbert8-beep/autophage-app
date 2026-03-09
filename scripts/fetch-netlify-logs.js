const axios = require('axios');
const fs = require('fs');

async function getLogs() {
    try {
        const siteId = 'e1f28383-a8e6-49d4-a019-5b64437806e1';
        const token = 'nfp_joQe4chnJg7kZ3kYQipAxTkLbgNitZUh76df';

        console.log("Fetching site deploys...");
        const deploysRes = await axios.get(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const latestDeployId = deploysRes.data[0].id;
        console.log(`Latest deploy ID: ${latestDeployId}`);

        // Fetch functions for this deploy
        console.log("Fetching functions...");
        const functionsRes = await axios.get(`https://api.netlify.com/api/v1/sites/${siteId}/functions`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Available functions:");
        for (const func of functionsRes.data.functions) {
            console.log(`- ${func.n}`);
        }
    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

getLogs();
