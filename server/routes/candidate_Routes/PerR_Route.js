import express from "express";
import { PerR } from "../../models/PerR_Model.js";
import { Log } from "../../models/log_Model.js";
import aTr_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', aTr_Validate, async (req, res) => {
    if( req.body.uid === null ||
        req.body.id === null ||
        req.body.name === null ||
        req.body.username === null ||
        req.body.company === null ||
        req.body.name === null ||
        req.body.designation === null ||
        req.body.relation === null ||
        req.body.from === null ||
        req.body.till === null ||
        req.body.email === null ||
        req.body.contact === null ||
        req.body.altContact === null
    ) {
        return res.status(400).send({
            message: 'Input fields missing. Invalid request'
        });
    }

    await PerR.create(req.body).then(async (entry) => {
        //Updating Logs
        const resp = await Log.findOneAndUpdate({uid: req.body.uid}, {form9: {enabled: true, submitted: true}}, {new: true});
        return res.status(201).send({
            message: `New Entry Created`,
            data: entry
        });
    }).catch((err) => {
        console.log('Database Connection Failed', err);
        return res.status(500).send({
            message: 'Database Connection Failed',
            data: err
        });
    });
});

router.post('/:uid', aTr_Validate, async (req, res) => {
    const {uid} = req.params;

    try {
        const data = await PerR.find({uid: uid});

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

router.delete('/:uid', aTr_Validate, async (req, res) => {
    const {uid} = req.params;
    try {
        const data = await PerR.findOneAndDelete({_id: uid});
        return res.status(200).json({
            message: 'User Entry Deleted',
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