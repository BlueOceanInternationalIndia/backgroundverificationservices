import express from 'express';
import rTa_Validate from '../../middlewares/rTa_Validate.js';
import { UserAcc } from '../../models/companyAdmin_Models/user_Model.js';
import { Debugging_ON } from '../../config/config.js';

const router = express.Router();

// router.post('/', rTa_Validate, async (req, res) => {
//     console.log('\nuserAction');
//     const session = { status: false , message: 'Invalid Session' };
//     res.status(200);
//     const newAction = `${(req.body.type == 0)? 'N' : (req.body.type == 1)? 'C' : '-'}:${req.body.action}`;
//     if(req.valid) await UserAcc.findOneAndUpdate({ 
//         _id: req.user.data.uid, 
//         $expr: { $ne: [{ $arrayElemAt: [{ $arrayElemAt: ['$actions', 0] }, -1] }, newAction] } }, 
//         {$push: { "actions.0": newAction }}, { new: true }).then((updatedClientProfile) => { session.status = true; if(Debugging_ON) console.log('->userActions.updatedClientProfile ', updatedClientProfile )}).catch((err) => console.log('Failed To Update User Logs. Error:\n', err));
    
//     return res.send(session);   
// });

router.post('/', rTa_Validate, async (req, res) => {
    if(Debugging_ON) console.log('\nCompanyAdmin.userAction');
    const action = { status: false , message: 'Repeated Action' };
    res.status(200);
    const newAction = `${(req.body.type == 0)? 'N' : (req.body.type == 1)? 'C' : '-'}:${req.body.action}`;
    if(Debugging_ON) console.log('CompanyAdmin.userAction.newAction -> ', newAction);
    
    await UserAcc.findOne({_id: req.user.data.uid}, {_id: 0, id: 0, name: 0, username: 0, password: 0, sessions: 0, createdAt: 0, updatedAt: 0, __v: 0}).then(async (actionLog) => {
        console.log('CompanyAdmin.userAction.ActionLog.actions[0]->', actionLog.actions[0]);
        if(req.valid) {
            if(req.body.type === 1 || actionLog.actions[0].length === 1) await UserAcc.findOneAndUpdate({ _id: req.user.data.uid, $expr: { $ne: [{ $arrayElemAt: [{ $arrayElemAt: ['$actions', 0] }, -1] }, newAction] } }, {$push: { "actions.0": newAction }}, { new: true }).then((updatedClientProfile) => { action.status = true; action.message = 'Action Updated'; if(Debugging_ON) console.log('->userActions.updatedClientProfile.actions[0] -> ', updatedClientProfile?.actions[0] )}).catch((err) => console.log('Failed To Update User Logs. Error:\n', err));
            if(req.body.type === 0) for(let i = actionLog.actions[0].length - 1; i >= 0; i--) if(String(actionLog.actions[0][i]).includes('N:')) { if(actionLog.actions[0][i] !== newAction) await UserAcc.findOneAndUpdate({ _id: req.user.data.uid}, {$push: { "actions.0": newAction }}, { new: true }).then((updatedClientProfile) => { action.status = true; action.message = 'Action Updated'; if(Debugging_ON) console.log('->userActions.updatedClientProfile.actions[0] -> ', updatedClientProfile.actions[0] )}).catch((err) => console.log('Failed To Update User Logs. Error:\n', err)); break }
        }
    })
    return res.send(action);   
});

//N -> Navigated To
//C -> Clicked On

export default router
