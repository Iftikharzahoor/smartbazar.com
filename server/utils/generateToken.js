import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  // Generate short-lived Access Token
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'shopmern_super_secret_jwt_key_32_characters_minimum',
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );

  // Generate long-lived Refresh Token
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'shopmern_super_secret_jwt_refresh_key_32_characters_minimum',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  // Configure Secure cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  };

  // Attach Refresh Token as a cookie
  res.cookie('refreshToken', refreshToken, cookieOptions);

  return accessToken;
};
