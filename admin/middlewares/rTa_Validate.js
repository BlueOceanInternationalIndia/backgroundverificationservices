import 'dotenv/config';
import data from '../services/data_Services.js';
import jwt from 'jsonwebtoken';
import { Debugging_ON } from '../config/config.js';

const rTa_Validate = (req, res, next) => {
    if(Debugging_ON) console.log('\nrTa_Validate');

    req.token = String(req.cookies['rTa'] || 'undefined');
    req.valid = false;
    req.message = 'No Token in Header';
    req.error = 'NOTOKEN'

    // console.log(req.token);

    //Validating Token Data
    if(req.token != 'undefined' && req.token != 'null' && req.token != ''){
        req.token = data.decodeJSON(data.base64ToArrayBuffer(req.token));

        //Verifying The Token
        jwt.verify(req.token, process.env.REFRESH_TOKEN_SECRET, (err, tokenObj) => {
            if(err) console.log(`${req.message = 'Failed To Read Token Data'}. Error:`, err);
            else if(tokenObj.type !== 'rTa' || tokenObj.origin !== 'Blueocean International India') { console.log(`${req.message = 'Invalid Token'} in Header`); res.clearCookie('rTa', { httpOnly: true, secure: true, sameSite: 'none' }) }
            else {
                // console.log('TOKEN OBJ->', tokenObj);
                req.valid = true;
                req.user = tokenObj;
                req.message = 'Valid Token';
                delete req.error;
            }
        });
    }
    next();
}

export default rTa_Validate