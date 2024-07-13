import express from 'express';
import { TokenInfo } from '../../models/token_Model.js';

const router = express.Router();

router.delete('/', async (req, res) => {
    console.log("Clearing Token Logs, All User Will Be Logged Out");
    
    await TokenInfo.deleteMany({}).then((entry) => {
        console.log("Token Logs Cleared");
        res.status(200).send({
            message: 'Token Logs Cleared',
            deletedCount: entry.deletedCount
        });
    }).catch((err) => {
        console.log("Unable To Clear Token Logs. Error: ", err);
        res.status(500).send({
            message: 'Request Failed',
            error: err
        });
    })
    
})

export default router