import 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { TokenInfo } from '../../models/token_Model.js';
import rTa_Validate from '../../middlewares/tokenVerification.js';
import { aTr_Exp_Min } from '../../config/config.js';

const router = express.Router();

router.post('/access/valid', async (req, res) => {
    const token = req.body.token && req.body.token.split(' ')[1];
    
    //Validating Token Data
    if(token == null || token == 'null' || token == '') {
        console.log("No token in header, Invalid Request");
        return res.status(401).send({ valid: false, message: 'No Token In Header'})
    }

    //Verifying The Token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, tokenObj) => {
        if(err) {
            console.log('Token Verification Failed. Error:', err.message);
            return res.status(200).send({ valid: false, message: 'Token Verification Failed'});
        } else return res.status(200).send({ valid: true, message: 'Token Verified'});
    });
})

router.post('/access', rTa_Validate, async (req, res) => {
    if(!req.valid) {
        TokenInfo.findOneAndDelete({token: req.token}).catch((err) => console.log('Cannot Delete, Invalid Token. Error:', err))
        return res.status(401).send({ valid: false, message: req.message })
    } 
    
    // Finding Token
    TokenInfo.findOne({uid: req.user.uid}).then((resp) => {
        if(resp == null || resp == 'null' || resp === '' || resp.id != req.user.id || resp.username != req.user.username || resp.token != req.token) {
            return res.status(200).send({valid: false, message: 'Invalid Session, login again' })
        } 

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

        const accessSecret = process.env.ACCESS_TOKEN_SECRET,
            accessToken = jwt.sign(userData, accessSecret, {expiresIn: `${aTr_Exp_Min}m`});
    
        return res.status(200).send({valid: true, message: 'token Created', token: accessToken, exp: aTr_Exp_Min })
    }).catch((err) => {
        console.log('Database Connection Error', err);
        return res.status(500).send({ valid: false, message: 'Database Connection Error', error: err })
    })
})

router.delete('/', async (req, res) => {
    await TokenInfo.deleteMany({}).then((entry) => {
        res.status(200).send({
            message: 'Token Logs Cleared',
            deletedCount: entry.deletedCount
        });
    }).catch((err) => {
        console.log("Unable To Clear Token Logs. Error: ", err);
        res.status(500).send({
            message: 'Request Failed',
            error: err
        });
    });
    
});

export default router