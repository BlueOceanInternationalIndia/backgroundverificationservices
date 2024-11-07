import mongoose, { Schema } from 'mongoose';

const urlArchive_Schema = new Schema(
    {
        url: { type:String },
        exp: { type:Date }
    }
);

export const URL_Archive = mongoose.model('url', urlArchive_Schema);