import 'dotenv/config';
import express from 'express';
import rTa_Validate from '../middlewares/rTa_Validate.js';
import { URL_Archive } from '../models/urlArchive_Model.js';
import { Debugging_ON } from '../config/config.js';

const router = express.Router();

//Creating admin user
router.get('/:uid', rTa_Validate, async (req, res) => {
    if(Debugging_ON) console.log('\nurlArchive.get');
    const archivedURL = { status : false },
        uid = req.params.uid;
    res.status(500);
    if(Debugging_ON) console.log('\nurlArchive.uid -> ', uid);
    try{        
        await URL_Archive.findOne({_id: uid}).then(async (retrievedURL) => {
            console.log(`arlArchive.url -> `, retrievedURL);
            if(retrievedURL) archivedURL.status = Boolean(archivedURL.url = retrievedURL.url);
            res.status(200);
        }).catch((err) => console.log("Database Connection Failed. Error:\n", err))
    } catch(err) { console.log('Failed To Create URL. Error:\n', err) }
    return res.send(archivedURL);
});

router.delete('/:uid', rTa_Validate, async (req, res) => {
    if(Debugging_ON) console.log('\nurlArchive.delete');
    const deletedURL = { status : false },
        uid = req.params.uid;
    res.status(500);
    if(Debugging_ON) console.log('\nurlArchive.uid -> ', uid);
    try{        
        //Deleting Admin Profile
        await URL_Archive.findOneAndDelete({_id: uid}).then(async (retrievedURL) => {
            console.log(`arlArchive.url -> `, retrievedURL);
            if(retrievedURL) deletedURL.status = true;
            res.status(200);
        }).catch((err) => console.log("Database Connection Failed. Error:\n", err))
    } catch(err) { console.log('Failed To Delete URL. Error:\n', err) }
    return res.send(deletedURL);
});

export default router