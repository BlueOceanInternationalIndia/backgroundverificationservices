import express from 'express';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import { aTr_Exp_Min } from '../../config/config.js'
import { UserSession } from '../../models/session_Model.js';
import data from '../../services/data_Services.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

//Authenticating Login
router.get('/', rTa_Validate,  async (req, res) => {
    console.log('Access Token');
    const clientResp = { status: false , message: 'User Not Valid'};
    res.status(500);
    try{
        if(req.user.type === 'rTa' && req.user.origin === 'Blueocean International India' && req.user.access === 'CompanyAdmin') {
            await UserSession.findOne({uid: req.user.data.uid}).then(async (userSession) => {
                // console.log('User Session\n',userSession);
                if(userSession != null || userSession != 'null' || userSession != '') {
                    const reqToken = jwt.decode(data.decodeJSON(data.base64ToArrayBuffer(req.token))),
                    sessionToken = jwt.decode(userSession.token);
                    // console.log('token 1 -> ', reqToken);
                    // console.log('token 2 -> ', sessionToken);

                    for(let [key, val] of Object.entries(reqToken)) if((key === 'data')? val.uid !== sessionToken[`${key}`].uid: val !== sessionToken[`${key}`]) return res.status(400);

                    res.cookie('aTr', data.arrayBufferToBase64(data.encodeJSON(jwt.sign({type: 'aTr', data: sessionToken.data, origin: 'Blueocean International India', access: 'CompanyAdmin'}, await data.convertToPEM(userSession.privateKey), {algorithm: 'RS256', expiresIn: `${aTr_Exp_Min}m`}))), { httpOnly: false, secure: true, sameSite: 'none', maxAge: aTr_Exp_Min*60*1000 });
                    res.status(200);
                    clientResp.status = true;
                    clientResp.message = 'User Valid';
                    clientResp.user = data.arrayBufferToBase64(data.encodeJSON(await data.encrypt(userSession.publicKey, sessionToken.data)));
                }
            }).catch((err) => console.log('User Session Database Connection Failed. Error:\n', err))
        }
    }catch(err) {console.log('Cannot Validate User. Error:\n', err)}
    return res.send(clientResp) 
});
export default router

