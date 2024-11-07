import 'dotenv/config';
import data from "../services/data_Services.js"
import { UserSession } from '../models/session_Model.js';
import { Debugging_ON } from '../config/config.js';


const decrypt = async (req, res, next) => {
    if(Debugging_ON) console.log('\ndecryptionCompAdmin.decrypt', '\n::Valid->', req.valid, '\n::Token->', `${req.token?.substring(0, 15)}...${req.token?.slice(-15)}`, '\n::User->', req.user, '\n::Body->', req.body, '\n::File->', req.file, '\n::Message->', req.message, '\n::Error->', req.error);
    if(req.body) await UserSession.findOne({uid:req.user.data.uid}, {_id: 0, id: 0, uid: 0, name: 0, username: 0, publicKey: 0, token: 0, createdAt: 0, updatedAt: 0}).then(async (key) => { 
        if(Debugging_ON) console.log('\ndecryptionCompAdmin.decrypt.key.privateKey -> ', `${key.privateKey.substring(0, 15)}---${key.privateKey.slice(-15)}`); 
        // (req.body.data)? req.body.data = await data.decrypt(key.privateKey, req.body.data) : req.body = await data.decrypt(key.privateKey, req.body) 
        for(let [field, elem] of Object.entries(req.body)) req.body[field] = await data.decrypt(key.privateKey, elem);
    }).catch((err) => console.log('Company Admin Request Data Decryption Failed. Error:\n', err))
    next();
}

export default decrypt