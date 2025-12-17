import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mode : process.env.MODE || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  jwtRefreshExpiresIn: process.env.REFRESH_EXPIRES_IN_JWT || '7d',
};