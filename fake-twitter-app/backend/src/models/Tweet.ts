import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITweet extends Document {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    likes: mongoose.Types.ObjectId[];
    retweetOf?: mongoose.Types.ObjectId;
}

const TweetSchema: Schema<ITweet> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    retweetOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: null }
});

export const Tweet: Model<ITweet> = mongoose.model<ITweet>('Tweet', TweetSchema);
