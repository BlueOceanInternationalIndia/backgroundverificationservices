import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { Debugging_ON } from '../../config/config.js';
import googlecloud from '../../services/googlecloud_Services.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';

const router = express.Router();

//Creating admin user
router.delete('/:uid', rTa_Validate, async (req, res) => {
    if(Debugging_ON) console.log('\nAdmin.userDelete');
    const deleteUser = { status : false },
        uid = req.params.uid;
    res.status(500);
    
    try{        
        //Deleting Admin Profile
        await UserAcc.findByIdAndDelete(uid).then(async (deletedUser) => {
            console.log(`Admin ${deletedUser.username} Account Data Deleted Permanently`);
            const deletedFiles = await googlecloud.delete(uid);
            deleteUser.status = true;
            deleteUser.files = deletedFiles.status;
            deleteUser.message = 'Admin Account Deleted Permanently';
            res.status(200);
        }).catch((err) => console.log("Database Connection Failed. Error:\n", err))
    } catch(err) { console.log('Failed To Create Delete Admin. Error:\n', err) }
    return res.send(deleteUser);
});

export default router