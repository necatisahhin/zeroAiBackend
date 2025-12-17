import { Request, Response } from 'express';
import prisma from '@/lib/prisma';
import logger from '@/lib/winston';
import jwt from 'jsonwebtoken';
import { config } from '@/config/config';
import { validationResult } from 'express-validator';
import { getValidationErrorCode } from '@/utils/errorCodes';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization!!;

        const token = authHeader.substring(7);

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
        } catch (error) {
            return res.status(401).json({ 
                code: 'PROFILE_ERROR_05',
                message: 'Invalid or expired token' 
            });
        }

        const userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                fullname: true,
                role: true,
                isActive: true,
                socialMediaLinks: true,
                restaurants: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ 
                code: 'PROFILE_ERROR_02',
                message: 'User not found' 
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ 
                code: 'PROFILE_ERROR_03',
                message: 'User account is inactive' 
            });
        }

        return res.status(200).json({ 
            message: 'Profile retrieved successfully',
            user 
        });
    } catch (error) {
        logger.error('Error getting user profile:', error);
        return res.status(500).json({ 
            code: 'PROFILE_ERROR_04',
            message: 'Internal server error' 
        });
    }
};

export { updateProfileValidation } from '@/utils/validators/profileValidators';

export const updateProfile = async (req: Request, res: Response) => {
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

        const authHeader = req.headers.authorization!!;

        const token = authHeader.substring(7);

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
        } catch (error) {
            return res.status(401).json({ 
                code: 'PROFILE_ERROR_05',
                message: 'Invalid or expired token' 
            });
        }

        const userId = decoded.userId;
        const { fullname, socialMediaLinks,is_active,role } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ 
                code: 'PROFILE_ERROR_02',
                message: 'User not found' 
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ 
                code: 'PROFILE_ERROR_03',
                message: 'User account is inactive' 
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(is_active !== undefined && { isActive: is_active }),
                ...(role !== undefined && { role }),
                ...(fullname !== undefined && { fullname }),
                ...(socialMediaLinks !== undefined && { socialMediaLinks })
            },
            select: {
                email: true,
                fullname: true,
                role: true,
                isActive: true,
                socialMediaLinks: true,
                createdAt: true,
                updatedAt: true
            }
        });

        logger.info(`User profile updated: ${userId}`);

        return res.status(200).json({ 
            message: 'Profile updated successfully',
            user: updatedUser 
        });
    } catch (error) {
        logger.error('Error updating user profile:', error);
        return res.status(500).json({ 
            code: 'PROFILE_ERROR_06',
            message: 'Internal server error' 
        });
    }
};