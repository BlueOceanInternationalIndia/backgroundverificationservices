import express from 'express';
import { Consent } from '../../models/consent_Model.js';
import { Log } from '../../models/log_Model.js';
import aTr_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', aTr_Validate, async (req, res) => {
    //Validating Request
    if( req.body.uid == null ||
        req.body.id == null ||
        req.body.name == null ||
        req.body.username == null ||
        req.body.consent == null 
    ) return res.status(400).send({ message: 'Input fields missing. Invalid request' });

    const entry = await Consent.create(req.body).then(async (entry) => {
        //Updating Logs
        const resp = await Log.findOneAndUpdate({uid: req.body.uid}, {form0:{enabled: true, submitted: true}}, {new: true});
        if(resp == null) {
            console.log(`User Logs Not Updated for ${req.body.username}`);
            return res.status(500).send({ message: 'User logs not updated' })
        }
        return entry
    }).catch((err) => {
        console.log('Database Connection Failed', err);
        return res.status(500).send({ message: 'Database Connection Failed', error: err });
    });

    if(entry == null) return res.status(500).send({ message: 'Failed To Create New Entry', data: entry });
    else return res.status(201).send({ message: 'New Entry Created', data: entry });
});

router.post('/:uid', aTr_Validate, async (req, res) => {
    const {uid} = req.params;

    try {
        const data = await Consent.findOne({uid: uid});
        return res.status(200).json({
            message: 'Personal Details Sent',
            data: data
        }
        );
    }
    catch(err) {
        console.log(`Failed to get Personal Details\n${err}`);
        res.status(500).send({
            message: 'Failed to get Personal Details',
            error: err
        });
    }
});

export default router