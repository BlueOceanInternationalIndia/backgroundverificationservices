import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { Debugging_ON } from '../../config/config.js';
import googlecloud from '../../services/googlecloud_Services.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';

const router = express.Router();

//Creating admin user
router.get('/:file', rTa_Validate, async (req, res) => {
    if(Debugging_ON) console.log('\nAdmin.userFileURL');
    const file = req.params.file;
    res.status(500);

    const userFileURL = await googlecloud.generateURL(file);
    if(Debugging_ON) console.log('signedURL -> ', `${String(userFileURL.signedURL).substring(0, 31)}...${String(userFileURL.signedURL).slice(-70)}`)
    if(userFileURL.status) res.status(200);  
    return res.send(userFileURL);
});

export default router