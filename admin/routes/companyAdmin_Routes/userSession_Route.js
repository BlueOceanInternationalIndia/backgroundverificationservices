import 'dotenv/config';
import express from 'express';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import { UserSession } from '../../models/session_Model.js';

const router = express.Router();

//Validating Session
router.get('/', rTa_Validate,  async (req, res) => {
    console.log('Session', req.valid, req.token, req.user, req.message);
    const session = { status: false , message: 'Invalid Session' };
    res.status(200);
    if(req.valid && req.user.access === 'CompanyAdmin'){
        try{
            await UserSession.findOne({token: req.token}).then((activeSession) => {
                console.log('sessionLog-> ', activeSession, Object.entries(req.user.data));
                if(activeSession == null) res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' });
                else{
                    session.status = true
                    for(let [key, val] of Object.entries(req.user.data)) {
                        if(val !== req.user.data[`${key}`]) {
                            console.log(key, val, activeSession[`${key}`]);
                            res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' });
                            session.status = false
                            break;
                        }
                    }
                    if(session.status) { session.message = 'Valid Session'; session.user = req.user.data; }
                }
            }).catch((err) => console.log(`${(session.message = 'Database Connection Failed')}. Error:\n`, err, res.status(500)));
            }catch(err) { console.log(`${(session.message = 'Authentication Failed')}. Error:\n`, err, res.status(500)) }    
    }else await UserSession.findOneAndDelete({token: req.token}).then(() => session.message = req.message).catch((err) => console.log('Cannot Delete Invalid Token. Error:', err));

    return res.send(session);    
});

export default router