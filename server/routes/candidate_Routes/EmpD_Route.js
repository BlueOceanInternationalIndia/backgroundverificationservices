import express from "express";
import { EmpD } from "../../models/EmpD_Model.js";
import { Log } from "../../models/log_Model.js";
import aTr_Validate from '../../middlewares/tokenVerification.js';

const router = express.Router();

router.post('/', aTr_Validate, async (req, res) => {
    if( req.body.uid === null ||
        req.body.id === null ||
        req.body.name === null ||
        req.body.username === null ||
        req.body.company === null ||
        req.body.designation === null ||
        req.body.department === null ||
        req.body.location === null ||
        req.body.joining === null ||
        req.body.leaving === null ||
        req.body.manager === null ||
        req.body.managerDesignation === null ||
        req.body.ctc === null ||
        req.body.contacts === null
    ) {
        return res.status(400).send({
            message: 'Input fields missing. Invalid request'
        });
    }

    await EmpD.create(req.body).then(async (entry) => {
        //Updating Logs
        const resp = await Log.findOneAndUpdate({uid: req.body.uid}, {form7: {enabled: true, submitted: true}}, {new: true});
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
        const data = await EmpD.find({uid: uid});
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
        const data = await EmpD.findOneAndDelete({_id: uid});
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