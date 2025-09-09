// src/config/auth.js
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
export const ACCESS_TOKEN_EXPIRY = '3d';
export const REFRESH_TOKEN_EXPIRY = '7d';