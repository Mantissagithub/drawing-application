const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Placeholder model import. Update it later with the real one.
const UserModel = require('../models/User.model'); // Import the actual User model

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: '30d',
  });

const hashPassword = async (plainTextPassword) =>
  await bcrypt.hash(plainTextPassword, parseInt(process.env.BCRYPT_ROUNDS));

// Check plain text password against encrypted one.
const comparePasswords = (plainTextPassword, hash) =>
  bcrypt.compareSync(plainTextPassword, hash);

// Find user by id and check access token validity.
const verifyAccessToken = (req, res, next) => {
  const accessToken = req.header('Authorization').split('Bearer ')[1];

  if (!accessToken) return res.status(401).send('Access Denied.');

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).send('Invalid Token.');
  }
};

class UserController {
  static register = async ({ username, email, password }) => {
    try {
      const hashedPassword = await hashPassword(password);
      const newUser = new UserModel({ username, email, password: hashedPassword });
      await newUser.save();
      return newUser;
    } catch (error) {
      // Handle registration error
      throw new Error('Registration failed');
    }
  };

  static login = async ({ email, password }) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      if (comparePasswords(password, user.password)) {
        const accessToken = generateAccessToken(user._id);
        return accessToken;
      } else {
        throw new Error('Incorrect password');
      }
    } catch (error) {
      // Handle login error
      throw new Error('Login failed');
    }
  };

  static updateProfileImage = async (req, res) => {
    try {
      const userId = req.userId;
      const imagePath = req.body.imagePath;
      await UserModel.findByIdAndUpdate(userId, { profileImage: imagePath });
      return 'Profile image updated successfully';
    } catch (error) {
      // Handle update profile image error
      throw new Error('Failed to update profile image');
    }
  };

  static deleteAccount = async (req, res) => {
    try {
      const userId = req.userId;
      await UserModel.findByIdAndDelete(userId);
      return 'Account deleted successfully';
    } catch (error) {
      // Handle delete account error
      throw new Error('Failed to delete account');
    }
  };

  static fetchUsers = async (req, res) => {
    try {
      const users = await UserModel.find({}, 'username email');
      return users;
    } catch (error) {
      // Handle fetch users error
      throw new Error('Failed to fetch users');
    }
  };

  static fetchUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await UserModel.findById(userId, 'username email');
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      // Handle fetch user by ID error
      throw new Error('Failed to fetch user by ID');
    }
  };
}

module.exports = UserController;