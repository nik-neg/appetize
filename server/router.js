const router = require('express').Router();
const upload = require('./middleware/upload');
const userController = require('./controllers/User.controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile/:id', userController.showProfile);
router.post('/profile/:id/upload', upload, userController.saveImage);
router.get('/profile/:id/download', userController.retrieveImage);
router.put('/profile/:id', userController.setZipCode);
router.post('/profile/:id/dashboard', userController.publishDish);
router.get('/profile/:id/dashboard/:radius', userController.checkDishesInRadius);
router.patch('/profile/:id/dashboard/:dailyTreatsID/:upDown', userController.upDownVote);

module.exports = router;
