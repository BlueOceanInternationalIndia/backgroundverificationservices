import express from 'express'
import { Log } from '../../models/log_Model.js'
import aTr_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', async (req, res) => {
        //Validate Input
    if( req.body.uid == null ||
        req.body.id == null ||
        req.body.name == null ||
        req.body.username == null ||
        req.body.form0.enabled == null ||
        req.body.form0.submitted == null ||
        req.body.form1.enabled == null ||
        req.body.form1.submitted == null ||
        req.body.form2.enabled == null ||
        req.body.form2.submitted == null ||
        req.body.form3.enabled == null ||
        req.body.form3.submitted == null ||
        req.body.form4.enabled == null ||
        req.body.form4.submitted == null ||
        req.body.form5.enabled == null ||
        req.body.form5.submitted == null ||
        req.body.form6.enabled == null ||
        req.body.form6.submitted == null ||
        req.body.form7.enabled == null ||
        req.body.form7.submitted == null ||
        req.body.form8.enabled == null ||
        req.body.form8.submitted == null ||
        req.body.form9.enabled == null ||
        req.body.form9.submitted == null
    ) return res.status(400).send({ message: 'Input fields missing. Invalid request' });

    //Creating a new entry
    const entry = await Log.create(req.body).catch((err) => {
        console.log('Data Server Connection Failed. Error:', err);
        return res.status(500).send({ message: 'Data Server Connection Failed', error: err });
    })

    if(entry == null || entry == '') {
        console.log('Failed To Create Candidate Logs');
        return res.status(500).send({ message: 'Failed To Create Candidate Logs, Try Again' });
    }

    return res.status(201).send({ message: `New Log Entry Created`, data: entry });
});

router.post('/:uid',aTr_Validate, async (req, res) => {
    const {uid} = req.params;

    const log = await Log.findOne({uid: uid}).catch((err) => {
        console.log('Data Server Connection Failed. Error:', err);
        return res.status(500).json({ valid: false, message: 'Server Connection Failed', error: err });
    });

    if(log == null || log == '') {
        return res.status(400).json({valid: false, message: 'Invalid Request' });
    }
    return res.status(200).json({valid : true, message: 'Log Sent', log: log });
});

export default router