import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    tweet: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Comment: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema);
