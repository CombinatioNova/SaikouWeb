import { Schema, model, Document } from 'mongoose';

interface PlayingTypes extends Document {
	game: string;
    gameID: number;
    playing: number;
}

const playingSchema: Schema = new Schema({
	game: { type: String },
    gameID: { type: Number },
    playing: { type: Number }
});

export = model<PlayingTypes>('PlayingCounts', playingSchema);