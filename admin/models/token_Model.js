import mongoose, { Schema } from 'mongoose';

const token_Schema = new Schema(
    {
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