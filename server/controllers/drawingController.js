const jwt = require('jsonwebtoken');
const uuid = require('uuid');

// Placeholder model import. Update it later with the real one.
const DrawingModel = require('../models/Drawing.model'); // Import the actual Drawing model

class DrawingController {
  static createDrawing = async (req, res) => {
    try {
      // Generate a unique identifier for every newly created drawing.
      const drawingId = uuid.v4();

      // Save a new drawing object consisting of the user ID, creation timestamp, last modified timestamp, and blank canvas.
      const newDrawing = new DrawingModel({
        drawingId,
        userId: req.userId, // Assuming userId is set in verifyAccessToken middleware
        createdAt: new Date(),
        lastModifiedAt: new Date(),
        canvas: [],
      });
      await newDrawing.save();
      return newDrawing;
    } catch (error) {
      // Handle create drawing error
      throw new Error('Failed to create drawing');
    }
  };

  static editDrawing = async (req, res) => {
    try {
      // Modify the existing drawing associated with the user who initiated the action.
      const drawingId = req.params.drawingId;
      const updatedCanvas = req.body.canvas; // Assuming canvas data is sent in the request body
      const updatedDrawing = await DrawingModel.findOneAndUpdate(
        { drawingId, userId: req.userId }, // Ensure only the user who created the drawing can edit it
        { canvas: updatedCanvas, lastModifiedAt: new Date() },
        { new: true }
      );
      if (!updatedDrawing) {
        throw new Error('Drawing not found or unauthorized to edit');
      }
      return updatedDrawing;
    } catch (error) {
      // Handle edit drawing error
      throw new Error('Failed to edit drawing');
    }
  };

  static retrieveDrawingsByUserId = async (req, res) => {
    try {
      // Retrieve the drawings linked to the specific user.
      const drawings = await DrawingModel.find({ userId: req.userId });
      return drawings;
    } catch (error) {
      // Handle retrieve drawings by user ID error
      throw new Error('Failed to retrieve drawings by user ID');
    }
  };

  static retrievePublicDrawings = async (req, res) => {
    try {
      // Retrieve publicly accessible drawings.
      const publicDrawings = await DrawingModel.find({ isPublic: true });
      return publicDrawings;
    } catch (error) {
      // Handle retrieve public drawings error
      throw new Error('Failed to retrieve public drawings');
    }
  };

  static deleteDrawing = async (req, res) => {
    try {
      // Remove a particular drawing tied to the initiating user.
      const drawingId = req.params.drawingId;
      const deletedDrawing = await DrawingModel.findOneAndDelete({ drawingId, userId: req.userId });
      
      if (!deletedDrawing) {
        throw new Error('Drawing not found or unauthorized to delete');
      }
      
      return 'Drawing deleted successfully';
    } catch (error) {
      // Handle delete drawing error
      throw new Error('Failed to delete drawing');
    }
  };
}

module.exports = DrawingController;