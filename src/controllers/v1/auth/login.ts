import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import logger from '@/lib/winston';
import { validationResult } from 'express-validator';
import { getValidationErrorCode } from '@/utils/errorCodes';
export { loginValidation } from '@/utils/validators/authValidators';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';

export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0];
            const errorCode = getValidationErrorCode(firstError.msg);
            return res.status(400).json({ 
                code: errorCode,
                message: firstError.msg
            });
        }

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                code: 'AUTH_ERROR_01',
                message: 'Invalid email or password' 
            });
        }

        const isLoggedIn = await prisma.refreshToken.findFirst({
            where: { userId: user.id }
        });

        const isActive = user.isActive;
        if (!isActive) {
            return res.status(403).json({ 
                code: 'AUTH_ERROR_03',
                message: 'User account is inactive' 
            });
        }

        if (isLoggedIn) {
            return res.status(400).json({ 
                code: 'AUTH_ERROR_02',
                message: 'User already logged in' 
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                code: 'AUTH_ERROR_01',
                message: 'Invalid email or password' 
            });
        }

        const token = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '5h' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        }).catch((err) => {
            logger.error('Error storing refresh token:', err);
        });

        logger.info(`User logged in: ${user.email}`);

        return res.status(200).json({ 
            message: 'Login successful', 
            token,
            refreshToken
        });
    } catch (error) {
        logger.error('Error during user login:', error);
        return res.status(500).json({ 
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error' 
        });
    }
}