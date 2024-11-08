import express from 'express';
import { TokenInfo } from '../../models/token_Model.js';
import rTa_Verify from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', rTa_Verify, async (req, res) => {
    const message = TokenInfo.findOneAndDelete({token: req.token}).then((resp) => {
        if(resp == null) {
            return 'Invalid Session, User Not Logged In'
        } else {
            return 'User Logged Out'
        }
        
    }).catch((err) => {
        return res.status(500).send({
            logout: false,
            message: 'Error Logging Out',
            error: err
        })
    });

    return res.status(200).send({
        logout: true,
        message: message,
    })
});

export default router
