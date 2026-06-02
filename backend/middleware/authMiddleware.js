import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_travel_key_123456!');

      // Get user from the token, excluding password
      req.user = await User.findById(decoded.id).select('-password');

      return next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Only reaches here if no Bearer token was found at all
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
