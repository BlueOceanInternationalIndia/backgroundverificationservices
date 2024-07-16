import mongoose, { Schema } from 'mongoose';

const Consent_Schema = new Schema(
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
        consent: {
            type: Boolean,
            required: true
        }
    },
    //For saving date and time of creation and last update
    {
        timestamps: true
    }
);

export const Consent = mongoose.model('Candidate_Consent', Consent_Schema);