import express from 'express';
import candidateLogs from './candidate_Routes/candidateLogs_Route.js'

const router = express.Router();

router.use('/logs', candidateLogs)

export default router