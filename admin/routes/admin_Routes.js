import express from 'express';
import userList from './admin_Routes/userList_Route.js'
import userCreate from './admin_Routes/userCreate_Route.js'
import userImageUpload from './admin_Routes/userImageUpload_Route.js'
import userEdit from './admin_Routes/userEdit_Route.js'
import userDelete from './admin_Routes/userDelete_Route.js'
import userFileURL from './admin_Routes/userFileURL_Route.js'
import userAuth from './admin_Routes/userAuth_Route.js'
import userAccessToken from './admin_Routes/userAccessToken_Route.js'
// import userSession from './admin_Routes/userSession_Route.js'
// import userValidate from './admin_Routes/userValidate_Route.js'
import userLogout from './admin_Routes/userLogout_Route.js'

const router = express.Router();

router.use('/', userList);
router.use('/create', userCreate);
router.use('/upload', userImageUpload);
router.use('/files', userFileURL);
router.use('/edit', userEdit);
router.use('/delete', userDelete);
// router.use('/auth', userAuth);
// router.use('/token', userAccessToken);
// router.use('/session', userSession);
// router.use('/validate', userValidate);
// router.use('/logout', userLogout);

export default router
