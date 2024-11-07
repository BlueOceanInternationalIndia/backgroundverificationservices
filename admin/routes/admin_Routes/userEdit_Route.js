import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { Debugging_ON, rTa_Exp_Hrs } from '../../config/config.js';
import googlecloud from '../../services/googlecloud_Services.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import decrypt from '../../middlewares/decryptionCompAdmin.js';
import { URL_Archive } from '../../models/urlArchive_Model.js';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
})

//Creating admin user
router.post('/:uid',rTa_Validate, upload.single('image'), decrypt, async (req, res) => {
    if(Debugging_ON) console.log('\nAdmin.userEdit', '\nBody -> ', req.body, '\nFile -> ', req.file);
    
    const editedUser = { status : false },
        uid = req.params.uid;
    res.status(500);

    try{
        //Validating Input
        for(let value of Object.values(req.body)) if(value == null || value == '') {
            console.log('Invalid CLient Response');
            return res.status(400).send(createdUser);
        }

        const editAdminAccount = {};
        //Updating Admin Image
        if(req.file) {
            const updatedImage = await googlecloud.update(req.file, uid, 'ProfileImage');
            editAdminAccount['image'] = updatedImage.imageName;
        }
        
        //Editing Admin Profile
        if(req.body.id) editAdminAccount['id'] = req.body.id;
        if(req.body.name) editAdminAccount['name'] = req.body.name;
        if(req.body.username) (req.body.username.includes('@blueoceaninternational'))? editAdminAccount['username'] = req.body.username : editedUser.message = 'Invalid Username';
        if(req.body.password) editAdminAccount['password'] = await bcrypt.hash(req.body.password, 10).catch((err) => { console.log(`${editedUser.message = 'Password Hashing Failed'}. Error:\n`, err) });
        if(req.body.access) editAdminAccount['access'] = JSON.parse(req.body.access);
        if(req.body.imageURL1) { const sessionExp = new Date(req.body.imageURL4 + rTa_Exp_Hrs * 60 * 60 * 1000); await URL_Archive.create({ url: `${req.body.imageURL1}GoogleAccessId=${req.body.imageURL2}&Expires=${req.body.imageURL3}`, exp: sessionExp }).then((archivedURL)=> editAdminAccount['imageURL'] = [sessionExp, archivedURL._id] ).catch((err)=> {console.log('Failed To Archive URL. Error:\n', err)}) }

        console.log(editAdminAccount)
        await UserAcc.findByIdAndUpdate(uid, {$set: editAdminAccount}, {new:true}).then((updatedUser) => {
            console.log(`Admin ${updatedUser.username} Account Data Edited`);
            editedUser.status = true;
            editedUser.message = 'Admin Account Edited';
            res.status(200);
        }).catch((err) => console.log("Database Connection Failed. Error:\n", err))
    } catch(err) { console.log('Failed To Create New Company Admin. Error:\n', err) }
    return res.send(editedUser);
});

export default router