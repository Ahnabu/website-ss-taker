const puppeteer = require('puppeteer');

const loginUrl = 'https://website/login/'; // Replace with your actual login page
const email = 'your@gmail.com'; // Replace with your email
const password = '12345'; // Replace with your password
const pages = [
    '',//add your page links here
    '',
   
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Handle any dialog (alert, prompt, confirm)
  page.on('dialog', async dialog => {
    console.log('Alert detected: ' + dialog.message());
    await dialog.dismiss(); // Dismiss the alert
    console.log('Alert dismissed.');
  });

  // Go to the login page
  await page.goto(loginUrl, { waitUntil: 'networkidle2' });

  // Type in the email and password
  await page.type('input[name="email"]', email); // Update selector for email input
  await page.type('input[name="password"]', password); // Update selector for password input

  // Wait for the login button to be visible and click it
  await page.waitForSelector('button.btn.btn-primary', { visible: true }); // Update this selector
  await Promise.all([
    page.click('button.btn.btn-primary'), // Update selector for the login button
    page.waitForNavigation({ waitUntil: 'networkidle2' }), // Wait for page to load after login
  ]);

  console.log('Login successful, proceeding to screenshots');

  // Now take screenshots of each page in both desktop and mobile views
  for (let i = 0; i < pages.length; i++) {
    const url = pages[i];

    try {
      // Desktop View
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
      await page.screenshot({ path: `screenshot-desktop-${i + 1}.png`, fullPage: true });
      console.log(`Desktop screenshot taken for ${url}`);
      
      // Mobile View
      await page.setViewport({ width: 375, height: 812, isMobile: true });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
      await page.screenshot({ path: `screenshot-mobile-${i + 1}.png`, fullPage: true });
      console.log(`Mobile screenshot taken for ${url}`);

    } catch (err) {
      console.error(`Failed to take screenshot for ${url}:`, err);
    }
  }

  await browser.close();
})();
