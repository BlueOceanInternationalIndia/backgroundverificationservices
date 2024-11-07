import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { Storage } from '@google-cloud/storage';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { Debugging_ON } from '../../config/config.js';

//Connecting to Cloud Storage
const storage = new Storage({
    projectId: 'blue-ocean-bgv',
    keyFilename: './config/blue-ocean-bgv-8c94d1c357e1.json'
})

const bucketName = 'blueoceaninternationalindia_bgv_bucket'
const bucket = storage.bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const router = express.Router();

//Creating admin user
router.post('/', upload.single('image'), async (req, res) => {
    if(Debugging_ON) console.log('\nAdmin.userImageUpload', '\nBody->', req, '\nFile->', req.file);
    
    const uploadedFile = { status : false };
    res.status(500);
    try{
        
        //Validating Input
        if(!req.file) {
            console.log(createdUser.message = 'Invalid CLient Response, No File In Header');
            return res.send(uploadedFile)
        }
        
        const Filename = `${req.body.uid}_ProfileImage_${Date.now()}`;
        if(Debugging_ON) console.log('Admin.userImageUpload.Filename -> ', Filename);

        //Converting to BLOB
        const BLOB = bucket.file(Filename);
        const BLOB_Stream = BLOB.createWriteStream({
            metadata:{
                contentType: req.file.mimetype
            }
        })

        BLOB_Stream.on('start', (err) => {
            console.log("Start", err);
            // return res.send({
            //     error: err
            // })
        })

        BLOB_Stream.on('error', (err) => {
            console.log("Error", err);
            // return res.send({
            //     error: err
            // })
        })

        BLOB_Stream.on('finish', () => {
            console.log("Complete");
            // return res.status(200).send({
            //     message: 'Uploaded'
            // })
        })
        
        BLOB_Stream.end(req.file.buffer)
        // //Creating New Admin Profile
        // const nameElems = req.body.name.split(' '),
        //     _username = `${nameElems[0].toLowerCase()}.${nameElems[nameElems.length - 1].toLowerCase()}@blueoceaninternational`,
        //     _password = await bcrypt.hash(req.body.password, 10).catch((err) => {
        //         console.log('Password Hashing Failed. Error:\n', err);
        //         return null;
        //     }),
        //     // adminAccountCount = await UserAcc.countDocuments(),
        //     adminAccountCount = await UserAcc.findOne({}, {_id: 0, name: 0, username: 0, password: 0, image: 0, tickets: 0, access: 0, sessions: 0, actions: 0, createdAt: 0, updatedAt: 0, __v: 0}).sort({_id:-1}),
        //     newAdminAccount = {
        //         id: adminAccountCount.id + 1,
        //         name: req.body.name,
        //         username: _username,
        //         password: _password,
        //         image: req.body.image,
        //         access: req.body.access
        //     }
        // if(_password != null || _password != '') {
        //     await UserAcc.create(newAdminAccount).then((user) => {
        //         console.log(`New Admin ${user.username} Added To Database`);
        //         createdUser.status = true;
        //         createdUser.message = 'New Admin Account Created';
        //         res.status(200);
        //     }).catch((err) => console.log("Database Connection Failed. Error:\n", err))
        // }
    } catch(err) { console.log('Failed To Create New Company Admin. Error:\n', err) }
    return res.send(uploadedFile);
});

export default router