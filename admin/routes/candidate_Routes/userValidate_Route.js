import 'dotenv/config';
import express from 'express';
import { TokenInfo } from '../../models/token_Model.js';
import rTa_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

//Validating User
router.post('/', rTa_Validate, async (req, res) => {
    // console.log("DATA", req.valid, req.token, req.user, req.message);

    if(!req.valid) {
        TokenInfo.findOneAndDelete({token: req.token}).catch((err) => console.log('Cannot Delete Invalid Token. Error:', err))
        return res.status(401).send({
            valid: false,
            message: req.message
        })
    } 
    
    // Finding Token
    console.log(`Validating User ${req.user.username}`);
    TokenInfo.findOne({token: req.token}).then((resp) => {
        if(resp == null || resp == 'null' || resp == '') {
            console.log('Invalid Session');
            return res.status(200).send({
                valid: false,
                message: 'Invalid Session, login again'
            })
        } 

        // console.log('User Verified', resp.body);
        const userData = {
            uid: req.user.uid,
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            username: req.user.username,
            log1: req.user.log_1,
            log2: req.user.log_2,
            log3: req.user.log_3,
        }
        console.log(`Valid User ${req.user.username}`);
        return res.status(200).send({
            valid: true,
            message: 'User Verified, Valid Session',
            user: userData
        })
    }).catch((err) => {
        console.log('Database Connection Error', err);
        return res.status(500).send({
            valid: false,
            message: 'Database Connection Error',
            error: err
        })
    })
})

export default router