import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendVerificationEmail } from '../utils/emailUtil.js';

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_travel_key_123456!', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists but is NOT verified and token has expired, allow re-registration
      if (!userExists.isVerified && userExists.verificationTokenExpires && userExists.verificationTokenExpires < Date.now()) {
        // Delete the stale unverified user so they can re-register
        await User.deleteOne({ _id: userExists._id });
      } else {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
    }

    // Generate unique verification token (24-hour expiration)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create user in unverified state
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      verificationToken,
      verificationTokenExpires,
    });

    if (user) {
      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.name, verificationToken, req);
      } catch (emailErr) {
        console.error('Failed to send verification email:', emailErr);
        // Don't fail registration if email sending fails — user can resend later
      }

      return res.status(201).json({
        message: 'Verification email sent. Please check your inbox.',
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Handle mongoose duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    return res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Login protection: Prevent unverified users from logging in
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email,
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether the email exists — show generic success
      return res.json({ message: 'If the email exists, a verification link has been sent.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This email is already verified. Please log in.' });
    }

    // Generate a fresh verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken, req);
    } catch (emailErr) {
      console.error('Failed to resend verification email:', emailErr);
    }

    return res.json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ message: 'Server error while resending verification email.' });
  }
};

// @desc    Verify verification token
// @route   GET /api/auth/verify/:token
// @access  Public (Redirects to client UI)
export const verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // Find user with active token that hasn't expired yet
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      console.log(`Verification failed: token ${token} is invalid or has expired.`);
      return res.redirect(`${clientUrl}/verify?status=failed&message=Token+expired+or+invalid`);
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log(`User ${user.email} verified successfully.`);
    return res.redirect(`${clientUrl}/verify?status=success`);
  } catch (error) {
    console.error('Email verification route error:', error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/verify?status=failed&message=Server+error+during+verification`);
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.json(req.user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({ message: 'Server error while fetching profile' });
  }
};
