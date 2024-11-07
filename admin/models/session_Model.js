import mongoose, { Schema } from 'mongoose';

const session_Schema = new Schema(
    {
        uid: { type: String, unique: true},
        id: { type: Number, unique: true },
        name: { type: String },
        username: { type: String, unique: true},
        access: { type: String },
        publicKey: { type: String, unique: true },
        privateKey: { type: String, unique: true },
        token: { type: String, unique: true }
    },
    { timestamps: true }
);

export const UserSession = mongoose.model('session', session_Schema);