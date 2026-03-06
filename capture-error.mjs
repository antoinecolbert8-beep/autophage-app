import puppeteer from 'puppeteer';

(async () => {
    console.log('Launch browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Watch for console errors and page errors
    page.on('console', async msg => {
        if (msg.type() === 'error') {
            console.log('--- BROWSER CONSOLE ERROR ---');
            console.log(msg.text());
            const args = msg.args();
            for (let i = 0; i < args.length; i++) {
                try {
                    const val = await args[i].jsonValue();
                    console.log(`Arg ${i}:`, val);
                } catch (e) {
                    // Ignore
                }
            }

            // Try to get JSHandle execution context stack
            for (const arg of msg.args()) {
                const remoteObject = arg._remoteObject;
                if (remoteObject && remoteObject.subtype === 'error') {
                    console.log('STACK TRACE:', remoteObject.description);
                }
            }
        }
    });

    page.on('pageerror', err => {
        console.log('--- BROWSER UNHANDLED ERROR ---');
        console.log(err.toString());
        console.log(err.stack);
    });

    console.log('Navigating to local production server...');
    try {
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    } catch (err) {
        console.error("Failed to load localhost:3000. Is the server running?", err.message);
        await browser.close();
        process.exit(1);
    }

    console.log('Filling out form...');
    await page.type('input[type="email"]', 'admin@genesis.ai');
    await page.type('input[type="password"]', 'Genesis2025!');

    console.log('Submitting login...');
    await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => { }),
    ]);

    console.log('Redirected to:', page.url());

    console.log('Waiting 8 seconds for dashboard to crash...');
    await new Promise(r => setTimeout(r, 8000));

    console.log('Done.');
    await browser.close();
})();
