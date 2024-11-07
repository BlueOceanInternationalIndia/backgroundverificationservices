import express from 'express';
import { UserSession } from '../../models/session_Model.js';
import rTa_Validate from '../../middlewares/rTa_Validate.js';

const router = express.Router();

router.get('/', rTa_Validate, async (req, res) => {
    console.log('userLogout');
    const logout = { status: false, message: 'Invalid Session' }
    logout.status = !((await UserSession.findOneAndDelete({token: req.token}).then((resp) => (resp == null)? false : console.log((logout.message = `User ${req.user.data.username} Logged Out @ ${new Date()}`))).catch((err) => console.log(`Failed To Logout User ${req.user.data.username}. Error:\n`, err))) === false);
    (logout.status)? res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' }) : null;
    return res.status((logout.status)? 200 : 500).send(logout)
});

export default router
