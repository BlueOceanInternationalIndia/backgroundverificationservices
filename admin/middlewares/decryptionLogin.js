import 'dotenv/config';
import data from "../services/data_Services.js"
import { Debugging_ON } from '../config/config.js';

const decrypt = async (req, res, next) => { if(Debugging_ON) console.log('\ndecryptionLogin.decrypt', `${req.body.data.substring(0, 15)}...${req.body.data.slice(-15)}`); req.body.data = await data.decrypt(JSON.parse(process.env.LOGIN_PVTKEY), req.body.data); next() }

export default decrypt