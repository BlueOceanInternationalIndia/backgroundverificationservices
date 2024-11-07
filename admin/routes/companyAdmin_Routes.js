import express from 'express';
import userCreate from '../routes/companyAdmin_Routes/userCreate_Route.js'
import userAuth from '../routes/companyAdmin_Routes/userAuth_Route.js'
import userAccessToken from '../routes/companyAdmin_Routes/userAccessToken_Route.js'
import userAction from '../routes/companyAdmin_Routes/userAction_Route.js'
import userSession from '../routes/companyAdmin_Routes/userSession_Route.js'
import userValidate from '../routes/companyAdmin_Routes/userValidate_Route.js'
import userLogout from '../routes/companyAdmin_Routes/userLogout_Route.js'
import userEdit from '../routes/companyAdmin_Routes/userEdit_Route.js'

const router = express.Router();

router.use('/create', userCreate);
router.use('/auth', userAuth);
router.use('/token', userAccessToken);
router.use('/action', userAction);
router.use('/logout', userLogout);
router.use('/edit', userEdit);
// router.use('/session', userSession);
// router.use('/validate', userValidate);

export default router
