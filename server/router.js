const router = require('express').Router();
const upload = require('./middleware/upload');
const userController = require('./controllers/User.controller');

const imageController = require('./controllers/Image.controller');
const publishController = require('./controllers/Publish.controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/profile/:id', userController.showProfile);
router.put('/profile/:id', userController.setZipCode);

router.post('/profile/:id/upload', upload, imageController.saveImage);
router.get('/profile/:id/download', imageController.retrieveImage);

router.post('/profile/:id/dashboard', publishController.publishDish);
router.get('/profile/:id/dashboard/:radius', publishController.checkDishesInRadius);
router.patch('/profile/:id/dashboard/:dailyTreatsID/:upDown', publishController.upDownVote);

module.exports = router;
