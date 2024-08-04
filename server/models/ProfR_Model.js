import mongoose, { Schema } from 'mongoose';

const ProfR_Schema = new Schema(
    {
        uid: {
            type: String,
            required: true
        },
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        designation: {
            type: String,
            required: true
        },
        relation: {
            type: String,
            required: true
        },
        from: {
            type: Date,
            required: true
        },
        till: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        contact: {
            type: String,
            required: true
        },
        altContact: {
            type: String,
            required: true
        },
    },
    //For saving date and time of creation and last update
    {
        timestamps: true
    }
);

export const ProfR = mongoose.model('Candidate_ProfessionalReferences', ProfR_Schema);