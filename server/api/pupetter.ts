import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default defineEventHandler(async (event) => {

        const cookies =
        [{
            name: 'csrftoken',
            value: 'zdXajZ8MjFwnVjnH5VtVGz',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-02-09T16:14:19.984Z').getTime(),
            size: 31,
            httpOnly: false,
            secure: true,
            session: false,
            priority: 'Medium',
        },
        {
            name: 'datr',
            value: 'MUpYaZ-Jj5Z2td2UvRsxDdXP',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-02-06T22:43:56.004Z').getTime(),
            size: 28,
            httpOnly: true,
            secure: true,
            session: false,
            sameSite: 'None',
            priority: 'Medium',
        },
        {
            name: 'dpr',
            value: '0.800000011920929',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2026-01-12T16:14:12.000Z').getTime(),
            size: 20,
            httpOnly: false,
            secure: true,
            session: false,
            sameSite: 'None',
            priority: 'Medium',
        },
        {
            name: 'ds_user_id',
            value: '48731179769',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2026-04-05T16:14:19.985Z').getTime(),
            size: 21,
            httpOnly: false,
            secure: true,
            session: false,
            sameSite: 'None',
            priority: 'Medium',
        },
        {
            name: 'ig_did',
            value: 'AEEC4864-BB66-48C4-BFD4-EFDF96F55AA9',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-01-02T22:45:06.327Z').getTime(),
            size: 42,
            httpOnly: true,
            secure: true,
            session: false,
            priority: 'Medium',
        },
        {
            name: 'ig_nrcb',
            value: '1',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-01-02T22:44:37.447Z').getTime(),
            size: 8,
            httpOnly: false,
            secure: true,
            session: false,
            priority: 'Medium',
        },
        {
            name: 'mid',
            value: 'aVhKMQALAAHABhlNUYfBg1Z98RXQ',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-02-06T22:43:56.000Z').getTime(),
            size: 31,
            httpOnly: false,
            secure: true,
            session: false,
            priority: 'Medium',
        },
        {
            name: 'ps_l',
            value: '1',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-02-06T22:43:56.238Z').getTime(),
            size: 5,
            httpOnly: true,
            secure: true,
            session: false,
            sameSite: 'Lax',
            priority: 'Medium',
        },
        {
            name: 'ps_n',
            value: '1',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-02-06T22:43:56.238Z').getTime(),
            size: 5,
            httpOnly: true,
            secure: true,
            session: false,
            sameSite: 'None',
            priority: 'Medium',
        },
        {
            name: 'rur',
            value: '"NHA\\05448731179769\\0541799165660:01feb2dbed7a19a76fb34cec5e7c33a1c3efec583b8b5bff50427bf7d31bcb11257352e5"',
            domain: '.instagram.com',
            path: '/',
            session: true,
            size: 110,
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
            priority: 'Medium',
        },
        {
            name: 'sessionid',
            value: '48731179769%3AryaYX1pLBBHPr3%3A24%3AAYgLOJFvekpAUFWSV9XNKFJpX5o-Bgk719r60PG7CQ',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2027-01-05T16:14:04.514Z').getTime(),
            size: 87,
            httpOnly: true,
            secure: true,
            session: false,
            sameSite: 'None',
            priority: 'Medium',
        },
        {
            name: 'wd',
            value: '1955x1181',
            domain: '.instagram.com',
            path: '/',
            expires: new Date('2026-01-12T16:14:19.000Z').getTime(),
            size: 11,
            httpOnly: false,
            secure: true,
            session: false,
            sameSite: 'Lax',
            priority: 'Medium',
        }
        ]

    const browser = await puppeteer.launch({
        args: puppeteer.defaultArgs({ args: chromium.args, headless: false }),
        defaultViewport: null,
        executablePath: await chromium.executablePath(),
        headless: false,
    });

    const page = await browser.newPage()

    await page.setCookie(...cookies)

    await page.setRequestInterception(true);
    page.on('request', req => {
        const blocked = ['image', 'stylesheet', 'font', 'media'];
        if (blocked.includes(req.resourceType())) req.abort();
        else req.continue();
    });

    await page.goto(`https://instagram.com/rmn.roocha`, { waitUntil: 'networkidle2' })

    const userData = await page.evaluate(() => {
        const name = document.querySelector('section > div > div > span')?.innerText || ''
        const image = document.querySelector('img')?.src || ''
        return { name, image }
    })

    return userData
}
)