import mongoose, { Schema } from 'mongoose';

const account_Schema = new Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        log_1: {
            type: Date,
            required: true
        },
        log_2: {
            type: Date,
            required: true
        },
        log_3: {
            type: Date,
            required: true
        }
    },
    //For saving date and time of creation and last update
    {
        timestamps: true
    }
);

export const AccInfo = mongoose.model('Candidate_AccountInfo', account_Schema);