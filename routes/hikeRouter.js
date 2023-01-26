const express = require('express');
const router = express.Router();
const hikeController = require('../controllers/hikeController')
//TODO CONFLICT IN ROUTES
router.route('/')
    .get(hikeController.getAllHikes)
    .post(hikeController.uploadHikeCover,hikeController.createNewHike)
    .put(hikeController.updateHike)
    .delete(hikeController.deleteHike)

router.route('/:id')
    .get(hikeController.getHikeById)

router.route("/all/:id")
    .get(hikeController.getAllHikesByUserId)

router.route('/join')
    .post(hikeController.joinHike)
    
module.exports = router;