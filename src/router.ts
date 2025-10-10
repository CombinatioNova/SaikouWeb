import { Router, Request, Response } from 'express';
import { Data, renderFile } from 'ejs';
import { join } from 'path';
import playingNow from './models/playing';

function renderEjsFile(filename: string, data?: Data, options?: Data) {
    return renderFile(join(__dirname, '../assets/html', filename), data, { ...options });
}

const router = Router();

/* 
TITLE: Saikou Home Page
URL: https://saikou.dev/
*/
router.get('/', async (request: Request, response: Response) => {
    const mwtPlaying = await playingNow.findOne({ gameID: 62124643 });
    response.send(await renderEjsFile('home.ejs', { mwtPlaying: mwtPlaying?.playing }));
});

/* 
TITLE: Saikou About Page
URL: https://saikou.dev/about
*/
router.get('/about', async (request: Request, response: Response) => {
    response.send(await renderEjsFile('about.ejs'));
});

/* 
TITLE: Saikou Privacy Policy
URL: https://saikou.dev/privacy-policy
*/
router.get('/privacy-policy', async (request: Request, response: Response) => {
    response.send(await renderEjsFile('privacy_policy.ejs'));
});

/* 
TITLE: Saikou Refund Policy
URL: https://saikou.dev/refund-policy
*/
router.get('/refund-policy', async (request: Request, response: Response) => {
    response.send(await renderEjsFile('refund_policy.ejs'));
});

/* 
TITLE: Saikou Terms Of Service
URL: https://saikou.dev/terms-of-service
*/
router.get('/terms-of-service', async (request: Request, response: Response) => {
    response.send(await renderEjsFile('tos.ejs'));
});

/* 
TITLE: Saikou Refund Policy
URL: https://saikou.dev/refund-policy
*/
router.get('/community-rules', async (request: Request, response: Response) => {
    response.send(await renderEjsFile('rules.ejs'));
});




// --- SEO STUFF ---

/* Robots Text File */
router.get('/robots.txt', async (request: Request, response: Response) => {
    response.type('text/plain')
    response.send(`Sitemap: https://saikou.dev/sitemap.txt`);
});

/* Sitemap */
router.get('/sitemap.txt', async (request: Request, response: Response) => {
   response.sendFile(join(__dirname, '../assets/data/sitemap.txt'))
});

export const websiteRoutes = router;