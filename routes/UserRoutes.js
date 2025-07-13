const express = require('express');
const router = express.Router();
const registerController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authenticate');
const asyncHandler = require('../utils/asyncHandler');

router.post('/register', asyncHandler(registerController.registerUser));
router.post('/login',asyncHandler(registerController.loginUser));
router.get('/preferences', authenticate, asyncHandler(registerController.getPreferences));
router.put('/preferences', authenticate, asyncHandler(registerController.updatePreferences));
router.get('/news',authenticate, asyncHandler(registerController.getNews));


module.exports = router;