const express = require('express');
const router = express.Router();
const hikeController = require('../controllers/hikeController')

router.route('/')
    .get(hikeController.getAllHikes)
    .post(hikeController.createNewHike)
    .put(hikeController.updateHike)
    .delete(hikeController.deleteHike)

router.route('/:id')
    .get(hikeController.getHikeById)

router.route('/join')
    .post(hikeController.joinHike)
    
module.exports = router;