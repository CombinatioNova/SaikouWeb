import express from 'express';
import axios from 'axios';
import { join } from 'path';
import { renderFile } from 'ejs';
import { config } from 'dotenv';
import { connect, set } from 'mongoose';
import { green } from 'chalk';
import { websiteRoutes } from './router';
import playingCount from './models/playing';

config();
const app: express.Application = express();

app.use('/assets', express.static('assets'));

app.use(websiteRoutes);

/* 404 Page */
app.get('*', async (request: express.Request, response: express.Response) => {
    response.send(await renderFile(join(__dirname, '../assets/html/404.ejs')));
});

app.listen(4000, async () => {
    try {
		/* Connecting to Mongo Database */
		const databaseOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			keepAlive: true,
		};

        set('strictQuery', false);
		await connect(`${process.env.MONGO_PASSWORD}`, databaseOptions).then((): void => console.log(green(`[mongo_database]: Connected to MongoDB successfully.`)));
		console.log(green('[server]: 🚀 Listening on port 4000!'));
	} catch (err) {
		console.error(err);
	}
})

/* Update playing count every 2 minutes */
setInterval(async () => {
    const PLACE_ID: Array<number> = [62124643];
	const UNIVERSE_ID: Array<number> = [];
    let PLAYING_DATA: number = 0;
    const playing = await playingCount.findOne({ gameID: 62124643 });

	/* Fetching Universe ID from Place ID's provided */
	for (const id of PLACE_ID) {
		await axios
			.get(`https://apis.roblox.com/universes/v1/places/${id}/universe`)
			.then((response: any) => UNIVERSE_ID.push(response.data.universeId))
			.catch(() => {});
	}

	/* Fetching Concurrent Player Data */
	await axios
		.get(`https://games.roblox.com/v1/games?universeIds=${UNIVERSE_ID.join(',')}`)
		.then(async (response: any) => {
			for (const game of response.data.data) {
                PLAYING_DATA = game.playing;
			}
		})
		.catch(() => {});

        if (!playing) {
            await playingCount.create({
                game: 'Military Warfare Tycoon',
                gameID: 62124643,
                playing: PLAYING_DATA
            })
        } else {
            await playingCount.findOneAndUpdate({ gameID: 62124643, playing: PLAYING_DATA });
        }

}, 120000)