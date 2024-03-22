const express = require('express');
const router = express.Router();
const drawController = require('../controllers/drawingController');

router.post('/', drawController.createDrawing); // Update to use createDrawing instead of createDrawingHandler
router.get('/:_id', drawController.retrieveDrawingsByUserId); // Update to use getDrawingById instead of getDrawingByIdHandler
router.get('/', drawController.retrievePublicDrawings); // Update to use getAllDrawings instead of getAllDrawingsHandler
router.put('/:_id', drawController.editDrawing); // Update to use updateDrawing instead of updateDrawingHandler
router.delete('/:_id', drawController.deleteDrawing); // Update to use deleteDrawing instead of deleteDrawingHandler

module.exports = router;