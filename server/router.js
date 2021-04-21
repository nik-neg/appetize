const router = require('express').Router();
const userController = require('./controllers/User.controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);

module.exports = router;
