import type { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import logger from '@/lib/winston';
import { getValidationErrorCode } from '@/utils/errorCodes';

export { registerValidation } from '@/utils/validators/authValidators';

export const register = async (req: Request, res: Response) => {
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

        const { fullname, email, password, socialMediaLinks } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                fullname,
                email,
                password: hashedPassword,
                socialMediaLinks: socialMediaLinks || {},
            },
            select: {
                id: true,
                email: true,
                fullname: true,
                createdAt: true,
            },
        });

        logger.info(`New user registered: ${newUser.email}`);

        return res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser 
        });
    } catch (error) {
        logger.error('Error during user registration:', error);
        return res.status(500).json({ 
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Internal server error' 
        });
    }
};