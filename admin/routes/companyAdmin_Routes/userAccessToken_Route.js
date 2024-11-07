import express from 'express';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import { aTr_Exp_Min } from '../../config/config.js'
import { UserSession } from '../../models/session_Model.js';
import data from '../../services/data_Services.js';
import jwt from 'jsonwebtoken';
import { Debugging_ON } from '../../config/config.js';

const router = express.Router();

//Authenticating Login
router.get('/', rTa_Validate,  async (req, res) => {
    if(Debugging_ON) console.log('\nAccess Token', '\nValid->', req.valid, '\nToken->', req.token, '\nUser->', req.user, '\nMessage->', req.message, '\nError->', req.error);
    const clientResp = { status: false , message: req.message, error: req.error};
    res.status(200);
    if(req.valid){
        if(req.user.type === 'rTa' && req.user.origin === 'Blueocean International India' && req.user.access === 'CompanyAdmin') {
            await UserSession.findOne({uid: req.user.data.uid}).then(async (userSession) => {
                if(Debugging_ON) console.log('User Session\n',userSession);
                if(userSession) {
                    const sessionToken = jwt.decode(req.token);
                    // console.log('Token -> ', sessionToken);
                    if(sessionToken.type === 'rTa' && sessionToken.origin === 'Blueocean International India' && sessionToken.access === 'CompanyAdmin') {
                        clientResp.status = true;
                        for(let [key, val] of Object.entries(req.user.data)) if(val !== sessionToken.data[`${key}`]) { console.log('Invalid User', key, val, sessionToken.data[`${key}`]); clientResp.status = false; break }
                        if(clientResp.status) {
                            res.cookie('aTr', data.arrayBufferToBase64(data.encodeJSON(jwt.sign({type: 'aTr', data: sessionToken.data, origin: 'Blueocean International India', access: 'CompanyAdmin'}, await data.convertToPEM(userSession.privateKey), {algorithm: 'RS256', expiresIn: `${aTr_Exp_Min}m`}))), { httpOnly: false, secure: true, sameSite: 'none', maxAge: aTr_Exp_Min*60*1000 });
                            clientResp.message = 'Valid User';
                            clientResp.user = data.arrayBufferToBase64(data.encodeJSON(await data.encrypt(userSession.publicKey, sessionToken.data)));
                        }
                    }
                }
            }).catch((err) => console.log('Cannot Validate User. Error:\n', err, res.status(500)));
        }
        if(!clientResp.status) await  UserSession.findOneAndDelete({uid: req.user.data.uid}).then(() => res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' })).catch((err) => console.log('Failed To Delete Invalid Session. Error:\n', err, res.status(500)));
    }
    if(Debugging_ON) console.log('->AccessToken.clientResp ', clientResp);
    return res.send(clientResp) 
});
export default router

