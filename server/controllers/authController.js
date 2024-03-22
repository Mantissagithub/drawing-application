const jwt = require('jsonwebtoken');
const UserController = require('./UserController');

class AuthController {
  static refreshAccessToken = (req, res) => {
    const oldAccessToken = req.body.oldAccessToken;

    if (!oldAccessToken)
      return res.status(400).send({ error: 'Old Access Token Required.' });

    try {
      const decoded = jwt.verify(
        oldAccessToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const newAccessToken = UserController.generateAccessToken(decoded.userId);

      res.send({
        success: true,
        accessToken: newAccessToken,
        expiresIn: Number(process.env.JWT_EXPIRESIN),
      });
    } catch (ex) {
      res.status(400).send({ error: 'Failed to Refresh Token.' });
    }
  };

  static logout = (req, res) => {
    // Logic for invalidating access tokens could go here.
    // For example, you can blacklist the old access token or remove it from the client-side storage.
    res.send({ success: true, message: 'Logout successful' });
  };
}

module.exports = AuthController;