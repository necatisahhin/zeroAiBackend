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

export const createRestaurantValidation = [
    checkExtraFields(['name', 'address', 'phoneNumber','email']),
    body('name')
        .isString().withMessage('Restaurant name must be a string')
        .trim()
        .notEmpty().withMessage('Restaurant name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Restaurant name must be between 2 and 100 characters'),
    body('address')
        .isString().withMessage('Address must be a string')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
    body('phoneNumber')
        .isString().withMessage('Phone number must be a string')
        .optional()
        .trim()
        .isMobilePhone('any').withMessage('Invalid phone number format'),
    body('email')
        .isString().withMessage('Email must be a string')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
];

export const updateRestaurantValidation = [
    checkExtraFields(['name', 'address', 'phoneNumber','email','id']),
    body('id')
        .isString().withMessage('Restaurant ID must be a string')
        .notEmpty().withMessage('Restaurant ID is required'),
    body('name')
        .isString().withMessage('Restaurant name must be a string')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Restaurant name must be between 2 and 100 characters'),
    body('address')
        .isString().withMessage('Address must be a string')
        .optional()
        .trim()
        .isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters'),
    body('phoneNumber')
        .isString().withMessage('Phone number must be a string')
        .optional()
        .trim()
        .isMobilePhone('any').withMessage('Invalid phone number format'),
    body('email')
        .isString().withMessage('Email must be a string')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email format'),
];

export const deleteRestaurantValidation = [
    checkExtraFields(['id']),
    body('id')
        .notEmpty().withMessage('Restaurant ID is required'),
];