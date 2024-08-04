import express from "express";
import { PD } from "../../models/PD_Model.js";
import { Log } from "../../models/log_Model.js";
import aTr_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', aTr_Validate, async (req, res) => {
    if( req.body.uid === null ||
        req.body.id === null ||
        req.body.name === null ||
        req.body.username === null ||
        req.body.fullName === null ||
        req.body.fatherName === null ||
        req.body.motherName === null ||
        req.body.spouseName === null ||
        req.body.gender === null ||
        req.body.dob === null ||
        req.body.contact === null ||
        req.body.whatsapp === null ||
        req.body.email === null ||
        req.body.altEmail === null ||
        req.body.stateResi === null ||
        req.body.placeResi === null ||
        req.body.nationality === null ||
        req.body.highestQual === null ||
        req.body.aadhaar === null ||
        req.body.pan === null
    ) {
        return res.status(400).send({
            message: 'Input fields missing. Invalid request'
        });
    }

    await PD.create(req.body).then(async (entry) => {
        //Updating Logs
        const resp = await Log.findOneAndUpdate({uid: req.body.uid}, {form2: {enabled: true, submitted: true}}, {new: true});
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
        const data = await PD.findOne({uid: uid});
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