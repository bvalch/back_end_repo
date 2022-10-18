const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');


router.post('/',profileController.createProfile);
router.get('/getprofile',profileController.getProfile)
router.put('/update',profileController.updateProfile)
router.get('/getfprofile/:id',profileController.getForeignProfile)


module.exports = router;