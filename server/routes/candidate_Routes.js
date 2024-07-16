import express from 'express';
import Logs from './candidate_Routes/formLogs_Route.js';
import Consent from './candidate_Routes/consent_Route.js';

const router = express.Router();

router.use('/logs', Logs)
router.use('/consent', Consent)

export default router