// src/models/Follow.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFollow extends Document {
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
    createdAt: Date;
}

const FollowSchema: Schema<IFollow> = new mongoose.Schema({
    follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Follow: Model<IFollow> = mongoose.model<IFollow>('Follow', FollowSchema);
