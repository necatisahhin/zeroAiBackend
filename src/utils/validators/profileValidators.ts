import { body } from 'express-validator';
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

export const updateProfileValidation = [
    checkExtraFields(['fullname', 'socialMediaLinks','is_active','role']),
    body('fullname')
        .isString().withMessage('Full name must be a string')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    
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
    body('is_active')
        .isBoolean().withMessage('is_active must be a boolean')
        .optional()
        .isBoolean().withMessage('is_active must be a boolean'),
    body('role')
        .isString().withMessage('Role must be a string')
        .optional()
        .isIn(['user', 'admin','premium','elite']).withMessage('Invalid role'),
];
