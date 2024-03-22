const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/UserController');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.use(passport.authenticate('jwt', { session: false }));

router.patch('/updateprofileimage/:userId', UserController.updateProfileImage);
router.delete('/deleteaccount/:userId', UserController.deleteAccount);
router.get('/fetchusers', UserController.fetchUsers);
router.get('/fetchuserbyid/:userId', UserController.fetchUserById);

module.exports = router;