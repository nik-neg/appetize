const router = require('express').Router();
const upload = require('./middleware/upload'); // TODO: added jest --forceExit to remove binding
const auth = require('./middleware/auth');
const userController = require('./controllers/User.controller');

const imageController = require('./controllers/Image.controller');
const publishController = require('./controllers/Publish.controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', auth, userController.logoutUser); // optional auth for jwt blocklist?
router.get('/profile', auth, userController.showProfile);
router.put('/profile/:id', userController.setZipCode);

router.post('/profile/:id/upload', upload, imageController.saveImage);
router.get('/profile/:id/download', imageController.retrieveImage); // call with img tag
router.delete('/profile/:id/remove-images', imageController.removeImages);

router.post('/profile/:id/dashboard', publishController.publishDish);
router.get('/profile/:id/dashboard', publishController.checkDishesInRadius);
router.patch('/profile/:id/dashboard/:dailyTreatID/:upDown', publishController.upDownVote);
router.delete('/profile/:id/dashboard/:dailyTreatID', publishController.removeDish);

module.exports = router;
