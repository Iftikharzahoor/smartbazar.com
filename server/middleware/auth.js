import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ErrorResponse } from './errorHandler.js';

export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from Authorization Bearer header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Ensure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token validity
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'shopmern_super_secret_jwt_key_32_characters_minimum'
    );

    // Fetch user and attach to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorResponse('User account not found', 404));
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

export const admin = (req, res, next) => {
  // Confirm administrator privilege levels
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(new ErrorResponse('Not authorized as an administrator', 403));
  }
};
