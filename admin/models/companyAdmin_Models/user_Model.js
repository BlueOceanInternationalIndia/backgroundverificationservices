import mongoose, { Schema } from 'mongoose';

const user_Schema = new Schema(
    {
        id: { type: Number, unique: true },
        name: { type: String },
        username: { type: String, unique: true },
        password: { type: String, unique: true },
        sessions: { type: Array },
        actions: { type: Array }
    },
    { timestamps: true }
);

export const UserAcc = mongoose.model('companyadmin_account', user_Schema);