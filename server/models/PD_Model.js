import mongoose, { Schema } from 'mongoose';

const PD_Schema = new Schema(
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
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        fatherName: {
            type: String,
            required: true
        },
        motherName: {
            type: String,
            required: true
        },
        spouseName: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        whatsapp: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        altEmail: {
            type: String,
            required: true
        },
        stateResi: {
            type: String,
            required: true
        },
        placeResi: {
            type: String,
            required: true
        },
        nationality: {
            type: String,
            required: true
        },
        highestQual: {
            type: String,
            required: true
        },
        aadhaar: {
            type: String,
            required: true,
            unique: true
        },
        pan: {
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

export const PD = mongoose.model('Candidate_PersonalDetails', PD_Schema);