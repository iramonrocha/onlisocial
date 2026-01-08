import { getId } from '~/utils/createId'
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { putItem } from '~/aws/dynamodb/entities/actions/putItem'
import { updateItem } from '~/aws/dynamodb/entities/actions/updateItem'
import { getItem } from '~/aws/dynamodb/entities/actions/getItem'
import { Users } from '~/aws/dynamodb/entities/users'
import { verifyToken } from '@/utils/verifyToken'
import { ProfilesCompleted } from '~/aws/dynamodb/entities/instagram/profiles_completed'
import { queryUser_id } from '~/aws/dynamodb/tables/actions/queryUser_id'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { username, cost_per_follower, profile_id, user_id } = body

    const token = getCookie(event, 'token')
    if (!token) return null

    const decoded = verifyToken(token)
    if (!decoded?.id) return null

    const { id } = decoded

    // busca todos os profiles que pertencem ao usuário logado
    const profiles = await queryUser_id(id)

    if (!profiles || profiles.length === 0) {
        return { success: false, message: 'Nenhum profile encontrado para este usuário.' }
    }

    // extrai apenas os usernames
    const usernamesToCheck = profiles.map(p => p.username)

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

    await page.goto(`https://instagram.com/${username}`, {
        waitUntil: "networkidle2",
    });

    // Clicando no link de seguidores
    const followersLinkSelector = `a[href="/${username}/followers/"]`;
    await page.waitForSelector(followersLinkSelector);
    await page.click(followersLinkSelector);

    // Espera a modal de seguidores abrir
    const followersModalSelector = 'div[role="dialog"]';
    await page.waitForSelector(followersModalSelector);

    // Espera o input de pesquisa estar disponível
    const searchInputSelector = 'input[aria-label="Entrada da pesquisa"]';
    await page.waitForSelector(searchInputSelector);

    let foundUsername: string | null = null;

    for (const usernameToCheck of usernamesToCheck) {

        // Limpa o input
        await page.click(searchInputSelector, { clickCount: 3 });
        await page.keyboard.press('Backspace');

        // Digita o username
        await page.type(searchInputSelector, usernameToCheck, { delay: 100 });

        // Aguarda o Instagram atualizar a lista
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Captura os usernames visíveis
        const usernameSelector = `div > div > div > div > span > div > a > div > div > span`;

        const capturedUsernames = await page.$$eval(
            usernameSelector,
            spans => spans.map(s => s.textContent?.trim()).filter(Boolean)
        );

        if (capturedUsernames.includes(usernameToCheck)) {
            foundUsername = usernameToCheck;
            break; // para o loop assim que encontrar
        }
    }

    const found = Boolean(foundUsername);

    await browser.close()

    // Salva no banco **somente se o usuário foi encontrado**
    if (found) {
        const userId = getId();
        await putItem(ProfilesCompleted, {
            id: userId,
            user_id: id,
            profile_id
        });

        // Busca o usuário que está seguindo (quem está logado)
        const { Item: followerItems } = await getItem(Users, { id })

        const followedItemsList = await queryUser_id(user_id);

        if (!followedItemsList || followedItemsList.length === 0) {
            return { success: false, message: "Perfil não encontrado" };
        }

        const followedUser = followedItemsList[0];

        const { Item: followed } = await getItem(Users, { id: followedUser.user_id })

        // REMOVE pontos de quem está logado
        await updateItem(Users, {
            id,
            points: Math.max((followerItems.points || 0) - cost_per_follower, 0),
        });

        // ADICIONA pontos para quem foi seguido
        await updateItem(Users, {
            id: user_id,
            points: (followed.points || 0) + cost_per_follower,
        });

        return { success: true, message: "Perfil encontrado e salvo." };
    } else {
        return { success: false, message: "Usuário não encontrado no Instagram." };
    }
});