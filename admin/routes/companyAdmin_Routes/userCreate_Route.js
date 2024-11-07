import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import { UserAcc } from '../../models/companyAdmin_Models/user_Model.js'

const router = express.Router();

//Creating admin user
router.post('/', async (req, res) => {
    try{
        //Validating Input
        for(let value of Object.values(req.body)) if(value === null || value == '') return res.status(400).send({ status: false, message: 'Invalid Input. Missing Values' })
        
        //Creating New Admin Profile
        const nameElems = req.body.name.split(' '),
            _username = `${nameElems[0].toLowerCase()}.${nameElems[nameElems.length - 1].toLowerCase()}@companyadmin`,
            _password = await bcrypt.hash(req.body.password, 10).catch((err) => {
                console.log('Password Hashing Failed. Error:\n', err);
                return null;
            }),
            adminAccountCount = await UserAcc.countDocuments(),
            newCompAdminAccount = {
                id: adminAccountCount,
                name: req.body.name,
                email: req.body.email,
                username: _username,
                password: _password,
            }
        if(_password === null || _password == '') return res.status(500).send({ status: false, message: 'Password Hashing Failed' })

        if (await UserAcc.create(newCompAdminAccount).catch((err) => {
            console.log("Database Connection Failed. Error:\n", err);
            return res.status(500).send({ status: false, message: 'Failed To Add Company Admin'})
        })) return res.status(200).send({ status: true, message: 'New Admin Account Created'});
        else return res.status(500).send({ status: false, message: 'Null Response' })
    } catch(err) { 
        console.log('Failed To Create New Company Admin. Error:\n', err);
        return res.status(500).send({ status: false, message: 'Failed To Add Company Admin'})
    }
});

export default router