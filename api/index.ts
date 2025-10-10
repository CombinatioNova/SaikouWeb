import { VercelRequest, VercelResponse } from '@vercel/node';
import { join } from 'path';
import { renderFile } from 'ejs';

function renderEjsFile(filename: string, data?: any) {
    // In Vercel, we need to go up to the project root, then into assets
    const filePath = join(process.cwd(), 'assets', 'html', filename);
    return renderFile(filePath, data);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { url } = req;

    try {
        switch (url) {
            case '/':
                res.send(await renderEjsFile('home.ejs', { mwtPlaying: null }));
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
                res.sendFile(sitemapPath);
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