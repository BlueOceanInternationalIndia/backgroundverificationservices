import mongoose, { Schema } from 'mongoose';

const user_Schema = new Schema(
    {
        id: { type: Number, unique: true },
        name: { type: String },
        username: { type: String, unique: true },
        password: { type: String, unique: true },
        image: { type:String },
        imageURL: { type: Array },
        tickets: { type: Array },
        access: { type: Array },
        sessions: { type: Array },
        actions: { type: Array }
    },
    { timestamps: true }
);

function arrayLimit(val) {
    return val.length === 2;
}

export const UserAcc = mongoose.model('admin_account', user_Schema);