import express from 'express';
import Logs from './candidate_Routes/formLogs_Route.js';
import Consent from './candidate_Routes/consent_Route.js';
import PD from './candidate_Routes/PD_Route.js';
import AD from './candidate_Routes/AD_Route.js';
import EmpD from './candidate_Routes/EmpD_Route.js';
import ProfR from './candidate_Routes/ProfR_Route.js';
import PerR from './candidate_Routes/PerR_Route.js';


const router = express.Router();

router.use('/logs', Logs)
router.use('/consent', Consent)
router.use('/personaldetails', PD)
router.use('/addressdetails', AD)
router.use('/employmentdetails', EmpD)
router.use('/professionalreferences', ProfR)
router.use('/personalreferences', PerR)

export default router