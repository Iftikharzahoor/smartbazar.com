import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { generateToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// Helper to manually parse cookies from headers
const parseCookies = (req) => {
  if (!req.headers.cookie) return {};
  return Object.fromEntries(
    req.headers.cookie.split('; ').map(cookie => {
      const parts = cookie.split('=');
      return [parts[0], decodeURIComponent(parts[1])];
    })
  );
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return next(new ErrorResponse('User already registered with this email', 400));
    }

    // Generate random email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiry

    // Create user account
    user = await User.create({
      name,
      email,
      password,
      verificationToken,
      verificationExpire
    });

    // Verification URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const verifyUrl = `${clientUrl}/verify/${verificationToken}`;

    const message = `Welcome to ShopMERN, ${name}!\n\nPlease verify your email by clicking the link:\n\n${verifyUrl}`;
    const html = `
      <h1>Verify your ShopMERN account</h1>
      <p>Welcome, ${name}!</p>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Verify Account</a>
    `;

    // Send email
    await sendEmail({
      email: user.email,
      subject: 'ShopMERN Email Verification',
      message,
      html
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Verification email dispatched.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log in user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate tokens and set cookie
    const accessToken = generateToken(res, user._id);

    res.status(200).json({
      success: true,
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log out user / Clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.cookie('refreshToken', 'none', {
      httpOnly: true,
      expires: new Date(Date.now() + 5 * 1000), // expire in 5s
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile details
// @route   PUT /api/v1/auth/me/update
// @access  Private
export const updateDetails = async (req, res, next) => {
  const { name, email, phone, avatar } = req.body;

  try {
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change own password
// @route   PUT /api/v1/auth/me/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return next(new ErrorResponse('Please enter both old and new passwords', 400));
    }

    const user = await User.findById(req.user.id).select('+password');

    // Confirm old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Incorrect current password', 401));
    }

    // Set and encrypt new password
    user.password = newPassword;
    await user.save();

    // Re-issue tokens
    const token = generateToken(res, user._id);

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password handler - Email token
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('No account associated with this email', 404));
    }

    // Generate reset token
    const resetToken = user.generateResetPasswordToken();
    await user.save();

    // Reset url
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please click this link to reset your password:\n\n${resetUrl}\n\nThis token will expire in 10 minutes.`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>We received a request to reset your password. Click the link below to complete the action:</p>
      <a href="${resetUrl}" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, you can safely ignore this email.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'ShopMERN Password Reset',
      message,
      html
    });

    res.status(200).json({
      success: true,
      message: 'Reset token dispatched to email address'
    });
  } catch (error) {
    // Reset fields if sending fails
    const user = await User.findOne({ email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    }
    next(new ErrorResponse('Password reset email could not be sent', 500));
  }
};

// @desc    Reset password using token
// @route   PUT /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  // Hash token from param
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired password reset token', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset completed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email address
// @route   GET /api/v1/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired verification token', 400));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email address verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Issue new access token via refresh token cookie
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const cookies = parseCookies(req);
    const refToken = cookies.refreshToken;

    if (!refToken) {
      return next(new ErrorResponse('Refresh token not found', 401));
    }

    // Verify token
    const decoded = jwt.verify(
      refToken,
      process.env.JWT_REFRESH_SECRET || 'shopmern_super_secret_jwt_refresh_key_32_characters_minimum'
    );

    // Fetch user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('User account associated with this token not found', 401));
    }

    // Generate new Access Token
    const accessToken = generateToken(res, user._id);

    res.status(200).json({
      success: true,
      token: accessToken
    });
  } catch (error) {
    return next(new ErrorResponse('Invalid refresh token session', 401));
  }
};
