// import 'dotenv/config';
import express from 'express';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import decrypt from '../../middlewares/decryptionCompAdmin.js';
// import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { Debugging_ON } from '../../config/config.js';
import { UserSession } from '../../models/session_Model.js';
import data from '../../services/data_Services.js';

const router = express.Router();

//Creating admin user
router.post('/', rTa_Validate, decrypt, async (req, res) => {
    if(Debugging_ON) console.log('\nAdmin.userList', req.body);
    const adminList = { status: false, message: req.message, error: req.error }
    res.status(200);
    try {
        if(req.valid) {
            const fields = {};
            for(let [key, val] of Object.entries(req.body.data.fields)) if(!val) fields[`${key}`] = 0;
            if(Debugging_ON) console.log('Admin.userList.fields -> ', fields);
            
            if(req.body.data.user) await UserAcc.findOne({_id: req.body.uid}, fields).then((adminAcc) => {if(adminAcc){ adminList.data = adminAcc; adminList.message = `User ${req.body.username} Data Sent`; delete adminList.error } else { adminList.message = `User ${req.body.username} Not Found`; adminList.error = 'NOENTRY' }}).catch((err) => { console.log(`${adminList.message = 'Failed To Get Admin List'}. Error:\n`, err); adminList.error = 'DBCONNERR' }); 
            else await UserAcc.find({}, fields).then(async (adminAccs) => {
                await UserSession.findOne({uid: req.user.data.uid}, { _id: 0, uid: 0, id: 0, name: 0, username: 0, access: 0, privateKey: 0, token: 0, createdAt: 0, updatedAt: 0, __v: 0 }).then(async (key) => {
                    const adminAccArray = [];
                    for(let adminAcc of adminAccs) {
                        console.log('Admin.userList.adminAcc -> ', adminAcc);
                        adminAccArray.push(await data.encrypt(key.publicKey, adminAcc))
                    }
                    adminList.data = adminAccArray; 
                    adminList.status = true; 
                    adminList.message = 'Admin List Data Sent'; 
                    delete adminList.error 
                });
            }).catch((err) => { console.log(`${adminList.message = 'Failed To Get Admin List'}. Error:\n`, err); adminList.error = 'DBCONNERR' });
        }
    }catch(err) { console.log('Failed To Retrieve Data.Error:\n', err) }
    
    if(Debugging_ON) console.log('Admin.userList.adminList -> ', adminList);
    return res.send(adminList);
});

export default router