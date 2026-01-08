import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export const handler = async (event) => {
  let browser = null;

  try {
    // Lança o Chromium pré-compilado
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto('https://google.com', { waitUntil: 'networkidle2' });

    // Captura o HTML da página
    const html = await page.content();

    return {
      statusCode: 200,
      body: html,
    };
  } catch (err) {
    console.error('Erro:', err);
    return {
      statusCode: 500,
      body: 'Erro ao processar a página',
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
