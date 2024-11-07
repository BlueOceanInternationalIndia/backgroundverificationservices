import express from 'express';
import { UserSession } from '../../models/session_Model.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import { UserAcc } from '../../models/companyAdmin_Models/user_Model.js';

const router = express.Router();

router.get('/', rTa_Validate, async (req, res) => {
    console.log('\nuserLogout');
    const session = { status: false , message: req.message };
    res.status(200);
    if(req.valid) await UserSession.findOneAndDelete({uid: req.user.data.uid}).then(async (deletedSession) => { 
        if(deletedSession) await UserAcc.findOneAndUpdate({ _id: req.user.data.uid }, { $push: { [`sessions.${0}`]: new Date() }}).then(() => { 
            console.log((session.message = `User ${req.user.data.username} Logged Out @ ${new Date()}`)); 
            session.status = true 
        }).catch((err) => console.log((session.message = `Failed To Update User Logs For  ${req.user.data.username}. Error:\n`), err, res.status(500))); 
        else console.log((session.message = `Invalid Session For ${req.user.data.username}`)) 
    }).catch((err) => console.log((session.message = `Failed To Logout User ${req.user.data.username}. Error:\n`), err, res.status(500)))
    res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' });
    return res.send(session);   

    // const logout = { status: false, message: 'Invalid Session' }
    // logout.status = !((await UserSession.findOneAndDelete({token: req.token}).then((resp) => (resp == null)? false : console.log((logout.message = `User ${req.user.data.username} Logged Out @ ${new Date()}`))).catch((err) => console.log(`Failed To Logout User ${req.user.data.username}. Error:\n`, err))) === false);
    // (logout.status)? res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' }) : null;
    // return res.status((logout.status)? 200 : 500).send(logout)
});

export default router
