import express from 'express';
import homeRoutes from './home_Route.js'
import candidateRoutes from './candidate_Routes.js'

const router = express.Router();

router.use('/', homeRoutes);
router.use('/candidate', candidateRoutes);

export default router