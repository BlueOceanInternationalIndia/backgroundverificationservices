import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { AccInfo } from '../../models/account_Model.js'
import { TokenInfo } from '../../models/token_Model.js';
import {rTa_Exp_Hrs, aTr_Exp_Min} from '../../config/config.js'

const router = express.Router();

//Authenticating Login
router.post('/', async (req, res) => {
    // console.log(req.body);
    const username = req.body.user_name__,
        password = req.body.pass_word__;

    
        console.log(`Authenticating Login for ${username}`);
        const userValid = await AccInfo.findOne({username: username}).then(async (user) => {
            const userAuth = { valid: false, user: null }
            //Validating User
            if(user == null || user == 'null' || user == '') console.log(`Login Failed, Invalid Username`);
            else {
                //Validating Password
                if(await bcrypt.compare(password, user.password).catch((err) => console.log('Bcrypt failed. Error:', err))) {
                    userAuth.valid = true;
                    userAuth.user = user;
                } else console.log(`Invalid Password`);
            }
            return userAuth
        }).catch((err) => {
            console.log('Server Not Responding. Error:', err);
            return res.status(500).send({
                auth: false,
                message: 'Authentication Failed, Server Not Responding',
                error: err
            })
        })

        if(userValid.valid == false || userValid.user == null) return res.status(200).json({
            auth: false,
            message: 'Authentication Failed',
            error: 'Invalid Credentials'
        });  
        
        if(userValid.valid == null || userValid == null) {
            console.log('User Authentication Failed, Invalid response', userValid);
            return res.status(500).json({
                auth: false,
                message: 'Authentication Failed',
                error: 'Invalid Response From Server'
            });
        }

        // console.log(`User ${username} authenticated`, userValid.user);
        console.log(`User ${username} authenticated`);

        //Updating User Login Logs
        const activeUser = await AccInfo.findOneAndUpdate({username: username}, {
            log_1: Date.now(),
            log_2: userValid.user.log_1,
            log_3: userValid.user.log_2
        }, {new: true}).catch((err) => {
            console.log('Error Updating User Logs', err);
            return res.status(500).json({
                auth: false,
                message: 'Authentication Failed',
                error: 'Invalid Response From Server'
            });
        });

        console.log("Logs updated", activeUser);
        // console.log("Logs updated");

        const userData = {
            uid: activeUser._id,
            id:  activeUser.id,
            name :  activeUser.name,
            email: activeUser.email,
            username: activeUser.username,
            log_1: activeUser.log_1,
            log_2: activeUser.log_2,
            log_3: activeUser.log_3,
        },
        accessSecret = process.env.ACCESS_TOKEN_SECRET,
        refreshSecret = process.env.REFRESH_TOKEN_SECRET;
        
        const accessToken = jwt.sign(userData, accessSecret, {expiresIn: `${aTr_Exp_Min}m`});
        const refreshToken = jwt.sign(userData, refreshSecret, {expiresIn: `${rTa_Exp_Hrs}h`});
        
        if(accessToken == null || refreshToken == null || accessToken == 'null' || refreshToken == 'null') {
            console.log(`Failed To Create Session Tokens`); 
            return res.status(502).json({
                auth: false,
                message: 'Authentication Failed',
                error: 'Failed To Create Tokens'
            });  
        }
        console.log('Session Tokens Created');

        //Updating Token Logs
        await TokenInfo.create({token: refreshToken}).then(() => console.log('New Token Added')).catch((err) => {
            console.log('Failed To Add Tokens To Database. Error:', err);
            res.status(500).send({
                auth: false,
                message: 'Authentication Failed',
                error: 'Failed To Update Tokens'
            });   
        });

        userData.rTa = refreshToken;
        userData.rTa_exp = rTa_Exp_Hrs;
        userData.aTr = accessToken;
        userData.aTr_exp = aTr_Exp_Min;


        console.log(`User ${username} Logged In`);
        return res.status(200).json({
            auth: true,
            message: 'User Logged In',
            user: userData
        });  
    
});

export default router