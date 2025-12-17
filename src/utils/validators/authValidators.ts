import { body } from 'express-validator';
import prisma from '@/lib/prisma';
import { Request, Response, NextFunction } from 'express';

const checkExtraFields = (allowedFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const receivedFields = Object.keys(req.body);
        const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
        
        if (extraFields.length > 0) {
            return res.status(400).json({
                code: 'VALIDATION_ERROR',
                message: `Unexpected fields: ${extraFields.join(', ')}`
            });
        }
        next();
    };
};

export const registerValidation = [
    checkExtraFields(['fullname', 'email', 'password', 'socialMediaLinks']),
    body('fullname')
        .isString().withMessage('Full name must be a string')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    
    body('email')
        .isString().withMessage('Email must be a string')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .custom(async (value) => {
            const existingUser = await prisma.user.findUnique({ where: { email: value } });
            if (existingUser) {
                throw new Error('Email already in use');
            }
            return true;
        }),
    
    body('password')
        .isString().withMessage('Password must be a string')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('socialMediaLinks')
        .optional()
        .isObject().withMessage('Social media links must be an object'),
    
    body('socialMediaLinks.youtubeUrl')
        .optional()
        .isURL().withMessage('Invalid YouTube URL'),
    
    body('socialMediaLinks.instagramUrl')
        .optional()
        .isURL().withMessage('Invalid Instagram URL'),
    
    body('socialMediaLinks.twitterUrl')
        .optional()
        .isURL().withMessage('Invalid Twitter URL'),
    
    body('socialMediaLinks.facebookUrl')
        .optional()
        .isURL().withMessage('Invalid Facebook URL'),
    
    body('socialMediaLinks.linkedinUrl')
        .optional()
        .isURL().withMessage('Invalid LinkedIn URL'),
];

export const loginValidation = [
    checkExtraFields(['email', 'password']),
    body('email')
        .isString().withMessage('Email must be a string')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .isString().withMessage('Password must be a string')
        .notEmpty().withMessage('Password is required'),
];

export const refreshTokenValidation = [
    checkExtraFields(['refreshToken']),
    body('refreshToken')
        .isString().withMessage('Refresh token must be a string')
        .notEmpty().withMessage('Refresh token is required'),
];
