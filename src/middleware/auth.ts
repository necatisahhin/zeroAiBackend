import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import logger from '@/lib/winston';

interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                code: 'AUTH_MIDDLEWARE_01',
                message: 'Access token is required' 
            });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
            req.userId = decoded.userId;
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ 
                    code: 'AUTH_MIDDLEWARE_02',
                    message: 'Access token expired' 
                });
            }
            return res.status(401).json({ 
                code: 'AUTH_MIDDLEWARE_03',
                message: 'Invalid access token' 
            });
        }
    } catch (error) {
        logger.error('Error in auth middleware:', error);
        return res.status(500).json({ 
            code: 'AUTH_MIDDLEWARE_04',
            message: 'Internal server error' 
        });
    }
};
