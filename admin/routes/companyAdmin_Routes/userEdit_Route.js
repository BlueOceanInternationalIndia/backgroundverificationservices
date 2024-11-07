import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/companyAdmin_Models/user_Model.js'
import { Debugging_ON } from '../../config/config.js';

const router = express.Router();

//Creating admin user
router.post('/:uid', async (req, res) => {
    if(Debugging_ON) console.log('CompanyAdmin.userEdit', req.body);
    const editUser = { status: false },
        uid = req.params.uid;
    res.status(500);
    try{
        //Validating Input
        for(let value of Object.values(req.body.formData)) if(value === null || value == '') return res.status(400).send({ status: false, message: 'Invalid Input. Missing Values' })
        
        //Editing Admin Profile
        const editCompAdminAccount = {}
        (req.body.formData.id)? editCompAdminAccount['id'] = req.body.formData.id : null;
        (req.body.formData.name)? editCompAdminAccount['name'] = req.body.formData.name : null;
        (req.body.formData.username)? editCompAdminAccount['username'] = req.body.formData.username : null;
        (req.body.formData.password)? editCompAdminAccount['password'] = req.body.formData.password : null;
        (req.body.formData.image)? editCompAdminAccount['access'] = req.body.formData.access : null;
        (req.body.formData.access)? editCompAdminAccount['access'] = req.body.formData.access : null;
        // const nameElems = req.body.name.split(' '),
        //     _username = `${nameElems[0].toLowerCase()}.${nameElems[nameElems.length - 1].toLowerCase()}@companyadmin`,
        //     _password = await bcrypt.hash(req.body.password, 10).catch((err) => {
        //         console.log('Password Hashing Failed. Error:\n', err);
        //         return null;
        //     }),
        //     adminAccountCount = await UserAcc.countDocuments(),
        //     newCompAdminAccount = {
        //         id: adminAccountCount,
        //         name: req.body.name,
        //         email: req.body.email,
        //         username: _username,
        //         password: _password,
        //         access: 
        //     }
        // if(_password === null || _password == '') return res.status(500).send({ status: false, message: 'Password Hashing Failed' })

        // if (await UserAcc.create(newCompAdminAccount).catch((err) => {
        //     console.log("Database Connection Failed. Error:\n", err);
        //     return res.status(500).send({ status: false, message: 'Failed To Add Company Admin'})
        // })) return res.status(200).send({ status: true, message: 'New Admin Account Created'});
        // else return res.status(500).send({ status: false, message: 'Null Response' })
    } catch(err) { console.log(`${editUser.message = 'Failed To Edit Company Admin'}. Error:\n`, err) }
    return res.send(editUser);
});

export default router