import express from 'express';
import { UserSession } from '../../models/session_Model.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';

const router = express.Router();

//Validating User
router.post('/', rTa_Validate, async (req, res) => {
    if(!req.valid) {
        UserSession.findOneAndDelete({token: req.token}).catch((err) => console.log('Cannot Delete Invalid Token. Error:', err));
        return res.status(401).send({ status: false, message: req.message })
    } 
    
    // Finding Token
    UserSession.findOne({uid: req.user.uid}).then((resp) => {
        if(resp == null || resp == 'null' || resp === '' || resp.id != req.user.id || resp.username != req.user.username || resp.token != req.token) return res.status(200).send({ status: false, message: 'Invalid Session' })
        return res.status(200).send({ status: true, message: 'Valid Session', user: req.user});
    }).catch((err) => {
        console.log('Database Connection Error', err);
        return res.status(500).send({ status: false, message: 'Database Connection Error' })
    })
})

export default router