const router = require('express').Router();
const userController = require('./controllers/User.controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile/:id', userController.showProfile);
router.post('/profile/:id/upload', userController.saveImage);
router.get('/profile/:id/download', userController.retrieveImage);
router.post('profile/:id/dashboard', userController.publishDish);
router.put('/profile/:id', userController.setZipCode);

module.exports = router;
