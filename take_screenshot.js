const puppeteer = require('puppeteer');
const fileUrl = 'file:///' + process.argv[2].replace(/\\/g, '/');
const outputPath = process.argv[3];
const width = parseInt(process.argv[4]);
const height = parseInt(process.argv[5]);

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(fileUrl, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: outputPath, fullPage: true });
    await browser.close();
})();