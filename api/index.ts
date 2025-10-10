import { VercelRequest, VercelResponse } from '@vercel/node';
import { join } from 'path';
import { renderFile } from 'ejs';
import { readFileSync } from 'fs';
import axios from 'axios';

async function getRobloxPlayerCount(placeId: number): Promise<string> {
    try {
        // First get the universe ID from place ID
        const universeResponse = await axios.get(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
        const universeId = universeResponse.data.universeId;

        // Then get the playing count
        const gameResponse = await axios.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
        const playing = gameResponse.data.data[0]?.playing || 0;

        // Format the number nicely
        if (playing >= 1000) {
            return `${Math.floor(playing / 1000)}K+`;
        }
        return playing.toString();
    } catch (error) {
        console.error('Error fetching Roblox data:', error);
        return '1K+'; // Fallback
    }
}

function renderEjsFile(filename: string, data?: any) {
    // In Vercel, we need to go up to the project root, then into assets
    const filePath = join(process.cwd(), 'assets', 'html', filename);
    console.log('Trying to render:', filePath);
    return renderFile(filePath, data || {});
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { url } = req;

    try {
        switch (url) {
            case '/':
                const playerCount = await getRobloxPlayerCount(62124643);
                res.send(await renderEjsFile('home.ejs', { mwtPlaying: playerCount }));
                break;

            case '/about':
                res.send(await renderEjsFile('about.ejs'));
                break;

            case '/privacy-policy':
                res.send(await renderEjsFile('privacy_policy.ejs'));
                break;

            case '/refund-policy':
                res.send(await renderEjsFile('refund_policy.ejs'));
                break;

            case '/terms-of-service':
                res.send(await renderEjsFile('tos.ejs'));
                break;

            case '/community-rules':
                res.send(await renderEjsFile('rules.ejs'));
                break;

            case '/robots.txt':
                res.setHeader('Content-Type', 'text/plain');
                res.send('Sitemap: https://saikou.dev/sitemap.txt');
                break;

            case '/sitemap.txt':
                const sitemapPath = join(process.cwd(), 'assets', 'data', 'sitemap.txt');
                const sitemapContent = readFileSync(sitemapPath, 'utf-8');
                res.setHeader('Content-Type', 'text/plain');
                res.send(sitemapContent);
                break;

            default:
                res.send(await renderEjsFile('404.ejs'));
                break;
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}