import express from "express";
import { AD } from "../../models/AD_Model.js";
import { Log } from "../../models/log_Model.js";
import aTr_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', aTr_Validate, async (req, res) => {
    if( req.body.uid === null ||
        req.body.id === null ||
        req.body.name === null ||
        req.body.username === null ||
        req.body.currAddress1 === null ||
        req.body.currAddress2 === null ||
        req.body.currLandmark === null ||
        req.body.currCity === null ||
        req.body.currDistrict === null ||
        req.body.currState === null ||
        req.body.currPincode === null ||
        req.body.currSince === null ||
        req.body.currPost === null ||
        req.body.currPolice === null ||
        req.body.currOwner === null ||
        req.body.currType === null ||
        req.body.checkbox === null ||
        req.body.perAddress1 === null ||
        req.body.perAddress2 === null ||
        req.body.perLandmark === null ||
        req.body.perCity === null ||
        req.body.perDistrict === null ||
        req.body.perState === null ||
        req.body.perPincode === null ||
        req.body.perSince === null ||
        req.body.perPost === null ||
        req.body.perPolice === null ||
        req.body.perOwner === null ||
        req.body.perType === null
    ) {
        return res.status(400).send({
            message: 'Input fields missing. Invalid request'
        });
    }

    await AD.create(req.body).then(async (entry) => {
        //Updating Logs
        const resp = await Log.findOneAndUpdate({uid: req.body.uid}, {form3: {enabled: true, submitted: true}}, {new: true});
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
        const data = await AD.findOne({uid: uid});
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