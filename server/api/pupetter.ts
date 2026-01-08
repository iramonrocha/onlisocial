import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default defineEventHandler(async (event) => {

    const cookies = [
  {
    name: 'csrftoken',
    value: 'cOCflfsRfS-V37YgAAAbRV',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-02-12T19:38:40.525Z').getTime() / 1000),
    httpOnly: false,
    secure: true,
    session: false,
  },
  {
    name: 'datr',
    value: 'PgdgaUlZR67lMQa_Qh2jf4iQ',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-02-12T19:36:27.884Z').getTime() / 1000),
    httpOnly: true,
    secure: true,
    session: false,
    sameSite: 'None',
  },
  {
    name: 'ds_user_id',
    value: '48828732647',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2026-04-08T19:38:40.526Z').getTime() / 1000),
    httpOnly: false,
    secure: true,
    session: false,
    sameSite: 'None',
  },
  {
    name: 'ig_did',
    value: 'D1749D4F-B9FA-45B1-978F-658A25A08A4C',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-01-08T19:36:27.884Z').getTime() / 1000),
    httpOnly: true,
    secure: true,
    session: false,
    sameSite: 'None',
  },
  {
    name: 'mid',
    value: 'aWAHPgALAAG9ATNaCfc6SV6frouJ',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-02-12T19:36:29.000Z').getTime() / 1000),
    httpOnly: false,
    secure: true,
    session: false,
  },
  {
    name: 'ps_l',
    value: '1',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-02-12T19:37:43.905Z').getTime() / 1000),
    httpOnly: true,
    secure: true,
    session: false,
    sameSite: 'Lax',
  },
  {
    name: 'ps_n',
    value: '1',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-02-12T19:37:43.905Z').getTime() / 1000),
    httpOnly: true,
    secure: true,
    session: false,
    sameSite: 'None',
  },
  {
    name: 'rur',
    value: '"CCO\\05448828732647\\0541799437123:01feb15788c7dc8b9acaff8ccfcc1c3064a65acafadf0b23cbc84449705382adba304c2e"',
    domain: '.instagram.com',
    path: '/',
    session: true, // Cookie de sessão
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  },
  {
    name: 'sessionid',
    value: '48828732647%3AjvUOZuUdjoVk53%3A4%3AAYglaAy-sGClK8FcIcO7uVlJV6wYLPjbitmjAuGNLA',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2027-01-08T19:38:30.074Z').getTime() / 1000),
    httpOnly: true,
    secure: true,
    session: false,
    sameSite: 'None',
  },
  {
    name: 'wd',
    value: '807x889',
    domain: '.instagram.com',
    path: '/',
    expires: Math.floor(new Date('2026-01-15T19:38:47.000Z').getTime() / 1000),
    httpOnly: false,
    secure: true,
    session: false,
    sameSite: 'Lax',
  }
];

    const viewport = {
        deviceScaleFactor: 1,
        hasTouch: false,
        height: 1080,
        isLandscape: true,
        isMobile: false,
        width: 1920,
    };

    const browser = await puppeteer.launch({
        args: puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
        defaultViewport: viewport,
        executablePath: await chromium.executablePath(),
        headless: "shell",
    });

    const page = await browser.newPage()

    await page.setCookie(...cookies)

    await page.goto(`https://instagram.com/rmn.roocha`, { waitUntil: 'networkidle2' })

    const pageTitle = await page.title();

    return pageTitle
}
)