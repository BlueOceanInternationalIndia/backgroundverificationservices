import 'dotenv/config';
import express from 'express';
import decrypt from '../../middlewares/decryptionLogin.js';
import data from '../../services/data_Services.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { UserAcc } from '../../models/companyAdmin_Models/user_Model.js'
import { UserSession } from '../../models/session_Model.js';
import { rTa_Exp_Hrs, aTr_Exp_Min, Debugging_ON } from '../../config/config.js'

const router = express.Router();

//Authenticating Login
router.post('/', decrypt,  async (req, res) => {
    if(Debugging_ON) console.log('\nCompanyAdmin.userAuth', req.body.data);
    const clientResp = { status: false , message: 'Authentication Failed' };
    res.status(500);
    try{
        //Validating Input 
        for(let value of Object.values(req.body)) if(value == null || value == '') { clientResp.message = 'Invalid Input. Missing Values'; clientResp.error = 'NOINPUT'; return res.status(400).send(clientResp) }
        
        //Authenticating User
        await UserAcc.findOne({username: req.body.data.username}, {sessions: 0, actions: 0, createdAt: 0, updatedAt: 0, __v: 0}).then(async (user) => {            
            if(Debugging_ON) console.log('CompanyAdmin.userAuth.user -> ', user);
            //Validating and Authenticating Password
            if(!user || !user.password || !user._id) { if(Debugging_ON) console.log(`User Authentication Failed. Invalid Username`); res.status(200) }
            else if(await bcrypt.compare(req.body.data.password, user.password).catch((err) => { console.log('Bcrypt failed. Error:', err) })) {
                 clientResp.user = user;
                
                //Create Session SignedURL For User Images and Update imageURL
                
                //Updating User Sessions
                const dateTime = new Date();
                await UserAcc.findOneAndUpdate({_id: clientResp.user._id}, { $push: { sessions: { $each: [[dateTime, req.ip]], $position: 0 }, actions: { $each: [[dateTime]], $position: 0 }} }, {new: true}).then(async (updatedClientProfile) => {
                    if(Debugging_ON) console.log('CompanyAdmin.userAuth.updatedClientProfile.sessions[0] -> ', updatedClientProfile.sessions[0]);
                    if(Debugging_ON) console.log('CompanyAdmin.userAuth.updatedClientProfile.actions[0] -> ', updatedClientProfile.actions[0]);
                    if(!updatedClientProfile || !updatedClientProfile._id) { if(Debugging_ON) console.log(`Failed To Update User Sessions For ${clientResp.user.username}`) }
                    else {
                        //Generating Session Unique Encryption Key Pair
                        const keys = await data.genKeyPair(); 
                        keys.privateKey = await data.exportKey(keys.privateKey);
                        keys.publicKey = await data.exportKey(keys.publicKey);
                        if(!keys || !keys.privateKey || !keys.publicKey) clientResp.error = 'KEYGENFAIL';
                        else {
                            if(Debugging_ON) console.log('userAuth.privateKey -> ', `${keys.privateKey.substring(0, 15)}...${keys.privateKey.slice(-15)}`);
                            if(Debugging_ON) console.log('userAuth.publicKey -> ', `${keys.publicKey.substring(0, 15)}...${keys.publicKey.slice(-15)}`);
                            //Token Payload
                            const activeUser = { uid: updatedClientProfile._id, id: updatedClientProfile.id, name: updatedClientProfile.name, username: updatedClientProfile.username, /* access: updatedClientProfile.access, */ },
                            accessSecret = await data.convertToPEM(keys.privateKey),
                            refreshSecret = process.env.REFRESH_TOKEN_SECRET;

                            const accessToken = jwt.sign({type: 'aTr', data: activeUser, origin: 'Blueocean International India', access: 'CompanyAdmin', session: rTa_Exp_Hrs }, accessSecret, {algorithm: 'RS256', expiresIn: `${aTr_Exp_Min}m`});
                            const refreshToken = jwt.sign({type: 'rTa', data: activeUser, origin: 'Blueocean International India', access: 'CompanyAdmin', session: rTa_Exp_Hrs }, refreshSecret, {expiresIn: `${rTa_Exp_Hrs}h`});

                            //Session Payload
                            const payload = {};
                            for(let [key, val] of Object.entries(activeUser)) payload[key] = val;
                            payload.access = 'CompanyAdmin'; 
                            payload.publicKey = req.body.key;
                            payload.privateKey = keys.privateKey;
                            // activeUser.token = refreshToken;
                            // if(Debugging_ON) console.log('userAuth.payload -> ', payload);

                            if(!accessToken || !refreshToken) { if(Debugging_ON) console.log(`Failed To Create Session Tokens`); clientResp.error = 'TOKENGENFAIL' }
                            else {
                                await UserSession.findOneAndUpdate({uid: updatedClientProfile._id}, {publicKey: req.body.key, privateKey: keys.privateKey/*, token : refreshToken*/}, {new: true}).then(async (updatedUserSession) => {
                                    // if(Debugging_ON) console.log('userAuth.updatedUserSession -> ', updatedUserSession);
                                    if(!updatedUserSession) await UserSession.create(payload).then(() => { console.log(`User ${activeUser.username} logged in @${new Date()}`)}).catch((err) => { console.log('Failed To Add New Session. Error:', err); clientResp.error = 'DBCONNFAIL'; delete clientResp.user });
                                    else console.log(`User ${activeUser.username} re-logged in @${new Date()}`);

                                    res.cookie('rTa', data.arrayBufferToBase64(data.encodeJSON(refreshToken)).replace(/=+$/, ''), { httpOnly: true, secure: true, sameSite: 'none', maxAge: rTa_Exp_Hrs*60*60*1000 })
                                    res.cookie('aTr', data.arrayBufferToBase64(data.encodeJSON(accessToken)).replace(/=+$/, ''), { httpOnly: false, secure: true, sameSite: 'none', maxAge: aTr_Exp_Min*60*1000 })
                                    res.cookie('kEs', data.arrayBufferToBase64(data.encodeJSON(keys.publicKey)).replace(/=+$/, ''), { httpOnly: false, secure: true, sameSite: 'none', maxAge: rTa_Exp_Hrs*60*60*1000 })
                                    
                                    clientResp.status = true;
                                    clientResp.user = data.arrayBufferToBase64(data.encodeJSON(await data.encrypt(req.body.key, activeUser)));
                                    clientResp.session = rTa_Exp_Hrs;
                                    clientResp.message = 'User Logged In'
                                    res.status(200);
                                }).catch((err) => { console.log('Failed To Update Session. Error:', err); clientResp.error = 'DBCONNFAIL'; delete clientResp.user });
                            }
                        }
                    }
                }).catch((err) => console.log('Error Updating User Logs', err));
            } else { if(Debugging_ON) console.log('User Authentication Failed. Invalid Password'); res.status(200) };
        }).catch((err) => { console.log('Database Connection Failed. Error:', err); clientResp.error = 'DBCONNFAIL' })
    }catch(err) { console.log("Failed To Authenticate User. Error:\n", err) }
    return res.send(clientResp);
});

export default router