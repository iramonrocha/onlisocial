import { getId } from '~/utils/createId'
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { putItem } from '~/aws/dynamodb/entities/actions/putItem'
import { Profiles } from '~/aws/dynamodb/entities/instagram/profiles'
import { verifyToken } from '@/utils/verifyToken'
import AWS from 'aws-sdk'
import axios from 'axios'

const config = useRuntimeConfig()

const s3 = new AWS.S3({
    region: config.AWS_REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    }
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, cost_per_follower } = body

    const token = getCookie(event, 'token')
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded?.id) return null

    const { id } = decoded

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
        executablePath: await chromium.executablePath(),
        headless: true,
        args: [
            ...chromium.args,
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-features=site-per-process',
        ],
    });

    const page = await browser.newPage()

    // 1️⃣ User-Agent MOBILE (antes de tudo)
    await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
        'Version/16.0 Mobile/15E148 Safari/604.1'
    );

    await page.setCookie(...cookies)

    await page.setRequestInterception(true);
    page.on('request', req => {
        const blocked = ['image', 'stylesheet', 'font', 'media', 'other'];
        blocked.includes(req.resourceType())
            ? req.abort()
            : req.continue();
    });

    await page.goto(`https://instagram.com/${username}`, { waitUntil: 'networkidle2' })

    const userData = await page.evaluate(() => {
        const name = document.querySelector('section > div > span')?.innerText || ''
        const image = document.querySelector('img')?.src || ''
        return { name, image }
    })

    await browser.close()

    let s3ImageUrl = ''
    if (userData.image) {
        // Baixa a imagem do Instagram
        const response = await axios.get(userData.image, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, 'binary')

        // Gera o nome do arquivo
        const imageName = `instagram-profiles/${username}-${Date.now()}.jpg`

        // Faz upload para o S3
        const uploadResult = await s3
            .upload({
                Bucket: config.AWS_S3_BUCKET_NAME!,
                Key: imageName,
                Body: buffer,
                ContentType: 'image/jpeg',
                ACL: 'public-read', // Se quiser que fique público
            })
            .promise()

        s3ImageUrl = uploadResult.Location
    }

    const userId = getId()

    await putItem(Profiles, {
        id: userId,
        user_id: id,
        name: userData.name,
        image: s3ImageUrl, // Salva a URL do S3 no DynamoDB
        status: true,
        username,
        cost_per_follower,
    })

})