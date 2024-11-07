import 'dotenv/config';
import express from 'express';
import decrypt from '../../middlewares/decryptionLogin.js'
import data from '../../services/data_Services.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { UserAcc } from '../../models/admin_Models/user_Model.js'
import { UserSession } from '../../models/session_Model.js';
import { rTa_Exp_Hrs, aTr_Exp_Min, Debugging_ON } from '../../config/config.js'

const router = express.Router();

//Authenticating Login
router.post('/', decrypt,  async (req, res) => {
    if(Debugging_ON) console.log('Admin Auth');
    
    const clientResp = { status: false , message: 'Authentication Failed' },
        validInput = true;
    res.status(500);
    try{        
        //Validating Input 
        for(let value of Object.values(req.body)) if(value == null || value == '') {
            validInput = false;
            res.status(400)
            clientResp.message = 'Invalid Input. Missing Values';
        }
        
        if(validInput) {
            //Authenticating User
            await UserAcc.findOne({username: req.body.data.username}).then(async (user) => {            
                // console.log('User Auth', user);
                //Validating and Authenticating Password
                if(user == null || user == 'null' || user == '') console.log(`Login Failed, Invalid Username`);
                else if(await bcrypt.compare(req.body.data.password, user.password).catch((err) => {console.log('Bcrypt failed. Error:', err)})) {
                    clientResp.user = user;

                    //Updating User Sessions
                    const sessionLog = clientResp.user.sessions;
                    sessionLog.push([new Date(), req.ip])
                    await UserAcc.findOneAndUpdate({_id: clientResp.user._id}, { sessions: sessionLog }, {new: true}).then(async (updatedClientProfile) => {
                        // console.log('Updated User', updatedClientProfile);
                         if(updatedClientProfile == null || updatedClientProfile == 'null' || updatedClientProfile == '') console.log(`Failed To Update User Sessions For ${clientResp.user.username}`);
                        else {
                            //Generating Session Unique Encryption Key Pair
                            const keys = await data.genKeyPair();
                            if(!keys) return res.status(502);  
                            keys.privateKey = await data.exportKey(keys.privateKey);
                            keys.publicKey = await data.exportKey(keys.publicKey);
                            if(!keys) return res.status(502);
                            else {
                                // console.log('Session Keys',keys);
                                const activeUser = {
                                    uid: updatedClientProfile._id,
                                    id: updatedClientProfile.id,
                                    name: updatedClientProfile.name,
                                    username: updatedClientProfile.username
                                },
                                accessSecret = await data.convertToPEM(keys.privateKey),
                                refreshSecret = process.env.REFRESH_TOKEN_SECRET;

                                const accessToken = jwt.sign({type: 'aTr', data: activeUser, origin: 'Blueocean International India', access: 'Admin'}, accessSecret, {algorithm: 'RS256', expiresIn: `${aTr_Exp_Min}m`});
                                const refreshToken = jwt.sign({type: 'rTa', data: activeUser, origin: 'Blueocean International India', access: 'Admin'}, refreshSecret, {expiresIn: `${rTa_Exp_Hrs}h`});

                                if(accessToken == null || refreshToken == null || accessToken == 'null' || refreshToken == 'null'  || accessToken === '' || refreshToken === '') console.log(`Failed To Create Session Tokens`); 
                                else {
                                    await UserSession.findOneAndUpdate({uid: updatedClientProfile._id}, {publicKey: req.body.key, privateKey: keys.privateKey, token : refreshToken}, {new: true}).then(async (updatedUserSession) => {
                                        // console.log('Updated Session', updatedUserSession);
                                        //New Login Or User Trying To Login Again
                                        if(updatedUserSession == null) await UserSession.create({uid: updatedClientProfile._id, id: updatedClientProfile.id, name: updatedClientProfile.name, username: updatedClientProfile.username, publicKey: req.body.key, privateKey: keys.privateKey, token: refreshToken}).then((newUserSession) => {
                                            console.log('New Session', newUserSession);
                                            console.log(`User ${activeUser.username} logged in @${new Date()}`)
                                        }).catch((err) => console.log('Failed To Add Tokens To Database. Error:', err));
                                        else console.log(`User ${activeUser.username} re-logged in @${new Date()}`);

                                        // console.log('Refresh -> ', data.arrayBufferToBase64(data.encodeJSON(refreshToken)),'\n','Active ->', data.arrayBufferToBase64(data.encodeJSON(accessToken)).replace(/=+$/, ''));
                                        // console.log('Refresh -> ', refreshToken,'\n','Active ->', accessToken);
                                        
                                        res.cookie('rTa', data.arrayBufferToBase64(data.encodeJSON(refreshToken)).replace(/=+$/, ''), { httpOnly: true, secure: true, sameSite: 'none', maxAge: rTa_Exp_Hrs*60*60*1000 })
                                        res.cookie('aTr', data.arrayBufferToBase64(data.encodeJSON(accessToken)).replace(/=+$/, ''), { httpOnly: false, secure: true, sameSite: 'none', maxAge: aTr_Exp_Min*60*1000 })
                                        res.cookie('kEs', data.arrayBufferToBase64(data.encodeJSON(keys.publicKey)).replace(/=+$/, ''), { httpOnly: false, secure: true, sameSite: 'none', maxAge: rTa_Exp_Hrs*60*60*1000 })
                                        
                                        clientResp.status = true;
                                        clientResp.user = data.arrayBufferToBase64(data.encodeJSON(await data.encrypt(req.body.key, activeUser)));
                                        clientResp.session = rTa_Exp_Hrs;
                                        clientResp.message = 'User Logged In'
                                        return res.status(200);
                                    }).catch((err) => console.log('Failed To Add Tokens To Database. Error:', err));
                                }
                            }
                        }
                    }).catch((err) => console.log('Error Updating User Logs', err));
                }
            }).catch((err) => console.log('Database Connection Failed. Error:', err))
        }
    }catch(err) { console.log("Failed To Authenticate User. Error:\n", err) }

    return res.send(clientResp);
});

export default router