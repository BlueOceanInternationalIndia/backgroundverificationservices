import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { Debugging_ON } from '../../config/config.js';
import googlecloud from '../../services/googlecloud_Services.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import decrypt from '../../middlewares/decryptionCompAdmin.js';

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }
})

//Creating admin user
router.post('/', rTa_Validate, upload.single('image'), decrypt, async (req, res) => {
    if(Debugging_ON) console.log('\nAdmin.userCreate', '\nBody -> ', req.body, '\nFile -> ', req.file);
    
    const createdUser = { status : false };
    res.status(500);
    try{
        //Validating Input
        for(let value of Object.values(req.body)) if(value == null || value == '') {
            console.log('Invalid CLient Response');
            return res.status(400).send(createdUser);
        }
        
        //Creating New Admin Profile
        const nameElems = req.body.name.split(' '),
            _username = `${nameElems[0].toLowerCase()}.${nameElems[nameElems.length - 1].toLowerCase()}@blueoceaninternational`,
            _password = await bcrypt.hash(req.body.password, 10).catch((err) => {
                console.log('Password Hashing Failed. Error:\n', err);
                return null;
            }),
            // adminAccountCount = await UserAcc.countDocuments(),
            adminAccountCount = await UserAcc.findOne({}, {_id: 0, name: 0, username: 0, password: 0, image: 0, tickets: 0, access: 0, sessions: 0, actions: 0, createdAt: 0, updatedAt: 0, __v: 0}).sort({_id:-1}),
            newAdminAccount = {
                id: adminAccountCount? adminAccountCount.id + 1 : 0,
                name: req.body.name,
                username: _username,
                password: _password,
                access: JSON.parse(req.body.access),
                image: 'null',
                imageURL: null
            }
        console.log(newAdminAccount);
        if(_password != null || _password != '') {
            await UserAcc.create(newAdminAccount).then(async (user) => {
                console.log(`New Admin ${user.username} Added To Database`);
                if(req.file){
                    const uploadedImage = await googlecloud.upload(req.file, user._id, 'ProfileImage');
                    if(Debugging_ON) console.log('Admin.userCreate.uploadedImage -> ', uploadedImage)
                    await UserAcc.findByIdAndUpdate(user._id, { image: uploadedImage.imageName }, { new:true }).then((updatedUser) => { if(Debugging_ON) console.log('Admin.userCreate.updatedUser -> ', updatedUser) })
                }
                createdUser.status = true;
                createdUser.message = 'New Admin Account Created';
                res.status(200);
            }).catch((err) => console.log("Database Connection Failed. Error:\n", err))
        }
    } catch(err) { console.log('Failed To Create New Company Admin. Error:\n', err) }
    return res.send(createdUser);
});

export default router