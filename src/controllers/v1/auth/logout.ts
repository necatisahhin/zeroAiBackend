import { Request, Response } from "express";
import prisma from '@/lib/prisma';
import logger from '@/lib/winston';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';

export const logout = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                code: 'LOGOUT_ERROR_01',
                message: 'Access token is required' 
            });
        }

        const token = authHeader.substring(7);

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
        } catch (error) {
            return res.status(401).json({ 
                code: 'LOGOUT_ERROR_02',
                message: 'Invalid or expired token' 
            });
        }

        const deletedTokens = await prisma.refreshToken.deleteMany({
            where: { userId: decoded.userId }
        });

        logger.info(`User ${decoded.userId} logged out successfully, ${deletedTokens.count} refresh token(s) deleted`);

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        logger.error('Error during user logout:', error);
        return res.status(500).json({ 
            code: 'LOGOUT_ERROR_03',
            message: 'Internal server error' 
        });
    }
};
        