import mongoose, { Schema } from 'mongoose';

const AD_Schema = new Schema(
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
        currAddress1: {
            type: String,
            required: true
        },
        currAddress2: {
            type: String,
            required: true
        },
        currLandmark: {
            type: String,
            required: true
        },
        currCity: {
            type: String,
            required: true
        },
        currDistrict: {
            type: String,
            required: true
        },
        currState: {
            type: String,
            required: true
        },
        currPincode: {
            type: String,
            required: true
        },
        currSince: {
            type: Date,
            required: true
        },
        currPost: {
            type: String,
            required: true
        },
        currPolice: {
            type: String,
            required: true
        },
        currOwner: {
            type: String,
            required: true
        },
        currType: {
            type: String,
            required: true
        },
        checkbox: {
            type: String,
            required: true
        },
        perAddress1: {
            type: String,
            required: true
        },
        perAddress2: {
            type: String,
            required: true
        },
        perLandmark: {
            type: String,
            required: true
        },
        perCity: {
            type: String,
            required: true
        },
        perDistrict: {
            type: String,
            required: true
        },
        perState: {
            type: String,
            required: true
        },
        perPincode: {
            type: String,
            required: true
        },
        perSince: {
            type: Date,
            required: true
        },
        perPost: {
            type: String,
            required: true
        },
        perPolice: {
            type: String,
            required: true
        },
        perOwner: {
            type: String,
            required: true
        },
        perType: {
            type: String,
            required: true
        },
    },
    //For saving date and time of creation and last update
    {
        timestamps: true
    }
);

export const AD = mongoose.model('Candidate_AddressDetails', AD_Schema);