import express from 'express';
import homeRoutes from './home_Route.js'
import compAdminRoutes from './companyAdmin_Routes.js'
import adminRoutes from './admin_Routes.js';
import urlArchive from './urlArchive_Routes.js';
// import candidateRoutes from './candidate_Routes.js'

const router = express.Router();

router.use('/', homeRoutes);
router.use('/companyadmin', compAdminRoutes);
router.use('/admin', adminRoutes);
router.use('/url', urlArchive);
// router.use('/candidate', candidateRoutes);

export default router