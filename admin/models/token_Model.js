import mongoose, { Schema } from 'mongoose';

const token_Schema = new Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true
        },
        id: {
            type: Number,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        token: {
            type: String,
            required: true,
            unique: true
        }
    },
    //For saving date and time of creation and last update
    {
        timestamps: true
    }
);

export const TokenInfo = mongoose.model('Candidate_TokenInfo', token_Schema);