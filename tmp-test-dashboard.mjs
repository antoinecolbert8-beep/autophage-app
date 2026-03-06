import puppeteer from 'puppeteer';

(async () => {
    console.log('Launch browser...');
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Watch for console errors and page errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('BROWSER CONSOLE ERROR:', msg.text());
        } else {
            console.log('BROWSER LOG:', msg.text());
        }
    });

    page.on('pageerror', err => {
        console.log('BROWSER UNHANDLED ERROR:', err.toString());
    });

    console.log('Navigating to login...');
    await page.goto('https://storied-longma-396754.netlify.app/login', { waitUntil: 'networkidle2' });

    console.log('Filling out form...');
    // Fill out email
    await page.type('input[type="email"]', 'admin@genesis.ai');
    // Fill out password
    await page.type('input[type="password"]', 'Genesis2025!');

    console.log('Submitting login...');
    // Click submit (assuming a button type=submit exists)
    await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    console.log('Redirected to:', page.url());

    console.log('Waiting 10 seconds for dashboard components to mount and potentially crash...');
    await new Promise(r => setTimeout(r, 10000));

    console.log('Taking screenshot...');
    await page.screenshot({ path: '/tmp/dashboard-debug.png' });

    console.log('Closing browser...');
    await browser.close();
})();
