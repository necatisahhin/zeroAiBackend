import { Request,Response } from "express";
import prisma from "@/lib/prisma";
import logger from "@/lib/winston";
import { validationResult } from "express-validator";
import { config } from "@/config/config";
import jwt from "jsonwebtoken";
import { getValidationErrorCode } from "@/utils/errorCodes";

const createRestaurant = async (req: Request, res: Response) =>{
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
        } catch (err) {
            return res.status(401).json({ 
                code: 'PROFILE_ERROR_01',
                message: 'Invalid access token' 
            });
        }

        const { name, address, phoneNumber, email } = req.body;
        const userId = decoded.userId;

        const existingPhoneNumber = await prisma.restaurants.findUnique({
            where: { phoneNumber }
        });
        if (existingPhoneNumber) {
            return res.status(400).json({
                code: 'VALL_ERROR_19',
                message: 'Phone number already in use'
            });
        }

        const existingEmail = await prisma.restaurants.findUnique({
            where: { email }
        });
        if (existingEmail) {
            return res.status(400).json({
                code: 'VALL_ERROR_04',
                message: 'Email already in use'
            });
        }

        const newRestaurant = await prisma.restaurants.create({
            data: {
                userId,
                name,
                address,
                phoneNumber,
                email,
            }
        });

        return res.status(201).json({
            code: 'RESTAURANT_CREATED',
            message: 'Restaurant created successfully',
            restaurant: newRestaurant
        });
    } catch (error) {
        logger.error('Error creating restaurant:', error);
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while creating the restaurant'
        });
    }
};

const updateRestaurant = async (req: Request, res: Response) => {
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

        const { name, address, phoneNumber, email, id } = req.body;
        const restaurantId = id;

        const existingRestaurant = await prisma.restaurants.findUnique({
            where: { id: restaurantId }
        });

        if (!existingRestaurant) {
            return res.status(404).json({
                code: 'RESTAURANT_NOT_FOUND',
                message: 'Restaurant not found'
            });
        }

        if (phoneNumber && phoneNumber !== existingRestaurant.phoneNumber) {
            const phoneConflict = await prisma.restaurants.findUnique({
                where: { phoneNumber }
            });
            if (phoneConflict) {
                return res.status(400).json({
                    code: 'VALL_ERROR_19',
                    message: 'Phone number already in use'
                });
            }
        }

        if (email && email !== existingRestaurant.email) {
            const emailConflict = await prisma.restaurants.findUnique({
                where: { email }
            });
            if (emailConflict) {
                return res.status(400).json({
                    code: 'VALL_ERROR_04',
                    message: 'Email already in use'
                });
            }
        }

        const updatedRestaurant = await prisma.restaurants.update({
            where: { id: restaurantId },
            data: {
                name: name ?? existingRestaurant.name,
                address: address ?? existingRestaurant.address,
                phoneNumber: phoneNumber ?? existingRestaurant.phoneNumber,
                email: email ?? existingRestaurant.email,
            }
        });

        return res.status(200).json({
            code: 'RESTAURANT_UPDATED',
            message: 'Restaurant updated successfully',
            restaurant: updatedRestaurant
        });
    } catch (error) {
        logger.error('Error updating restaurant:', error);
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while updating the restaurant'
        });

    }
}

const deleteRestaurant = async (req: Request, res: Response) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const firstError = errors.array()[0];
            const errorCode = getValidationErrorCode(firstError.msg);
            return res.status(400).json({ 
                code: errorCode,
                message: firstError.msg
            });
        }

        const { id } = req.body;
        const restaurantId = id;

        const existingRestaurant = await prisma.restaurants.findUnique({
            where: { id: restaurantId }
        });

        if (!existingRestaurant) {
            return res.status(404).json({
                code: 'RESTAURANT_NOT_FOUND',
                message: 'Restaurant not found'
            });
        }

        await prisma.restaurants.delete({
            where: { id: restaurantId }
        });

        return res.status(200).json({
            code: 'RESTAURANT_DELETED',
            message: 'Restaurant deleted successfully'
        });
    }catch (error) {
        logger.error('Error deleting restaurant:', error);
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An error occurred while deleting the restaurant'
        });
    }
};

export { createRestaurant , updateRestaurant, deleteRestaurant };