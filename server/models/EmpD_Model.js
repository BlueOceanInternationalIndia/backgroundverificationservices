import mongoose, { Schema } from 'mongoose';

const EmpD_Schema = new Schema(
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
        designation: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        joining: {
            type: Date,
            required: true
        },
        leaving: {
            type: Date,
            required: true
        },
        manager: {
            type: String,
            required: true
        },
        managerDesignation: {
            type: String,
            required: true
        },
        ctc: {
            type: String,
            required: true
        },
        contacts: {
            type: Object,
            required: true
        },
    },
    //For saving date and time of creation and last update
    {
        timestamps: true
    }
);

export const EmpD = mongoose.model('Candidate_EmploymentDetails', EmpD_Schema);