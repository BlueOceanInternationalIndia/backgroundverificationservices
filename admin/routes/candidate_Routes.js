import express from 'express';
import userAuth from './candidate_Routes/userAuth_Route.js'
import userValidate from './candidate_Routes/userValidate_Route.js'
import tokenLogs from './candidate_Routes/tokenLog_Route.js'
import userLogout from './candidate_Routes/userLogout_Route.js'

const router = express.Router();

router.use('/auth', userAuth);
router.use('/valid', userValidate);
router.use('/tokens', tokenLogs);
router.use('/logout', userLogout);

export default router