import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const ARTIFACTS_DIR = 'C:\\Users\\CHRIST\\.gemini\\antigravity\\brain\\df17fed7-e096-414a-831e-38c3f037023c';
const DOWNLOADS_SCREENSHOTS = 'C:\\Users\\CHRIST\\Downloads\\HugoFX_Playbooks_Codage\\screenshots';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

if (!fs.existsSync(DOWNLOADS_SCREENSHOTS)) {
  fs.mkdirSync(DOWNLOADS_SCREENSHOTS, { recursive: true });
}

async function main() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1600,1050'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1050, deviceScaleFactor: 1 });

  console.log('0. Capturing Landing Page Presentation...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_landing.png') });
  await page.screenshot({ path: path.join(DOWNLOADS_SCREENSHOTS, '00_Landing_Page_Presentation.png') });

  console.log('1. Navigating to Compiler Studio (clicking CTA button on landing)...');
  const ctaBtn = await page.$('button[data-testid="enter-dashboard-cta"]');
  if (ctaBtn) {
    await ctaBtn.click();
  } else {
    const navButtons = await page.$$('aside nav button');
    if (navButtons.length >= 2) await navButtons[1].click();
  }
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_main.png') });
  await page.screenshot({ path: path.join(DOWNLOADS_SCREENSHOTS, '01_Dashboard_Compiler_Studio.png') });

  console.log('2. Navigating to YouTube Corpus (Videos)...');
  let navButtons = await page.$$('aside nav button');
  if (navButtons.length >= 3) {
    await navButtons[2].click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_videos.png') });
    await page.screenshot({ path: path.join(DOWNLOADS_SCREENSHOTS, '02_YouTube_Corpus_106_Videos.png') });
  }

  console.log('3. Navigating to Formal Specs (Fiches)...');
  navButtons = await page.$$('aside nav button');
  if (navButtons.length >= 4) {
    await navButtons[3].click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_fiches.png') });
    await page.screenshot({ path: path.join(DOWNLOADS_SCREENSHOTS, '03_Fiches_Techniques_Dual_FSM.png') });
  }

  console.log('4. Navigating to Master Concepts (Bibles)...');
  navButtons = await page.$$('aside nav button');
  if (navButtons.length >= 5) {
    await navButtons[4].click();
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'dashboard_concepts.png') });
    await page.screenshot({ path: path.join(DOWNLOADS_SCREENSHOTS, '04_Master_Concepts_Bibles.png') });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
