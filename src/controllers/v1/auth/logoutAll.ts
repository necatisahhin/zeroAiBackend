import { Request,Response } from "express";
import prisma from '@/lib/prisma';
import logger from '@/lib/winston';
import { validationResult } from 'express-validator';
import { getValidationErrorCode } from '@/utils/errorCodes';
import bcrypt from 'bcrypt';

export const logoutAll = async (req: Request, res: Response) => {
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
         const {email , password} = req.body;
         const user = await prisma.user.findUnique({where:{email}});
         if(!user){
            return res.status(401).json({ 
                code: 'AUTH_ERROR_01',
                message: 'Invalid email or password' 
            });
         }
         const isPasswordValid = await bcrypt.compare(password, user.password);
         if (!isPasswordValid) {
            return res.status(401).json({ 
                code: 'AUTH_ERROR_01',
                message: 'Invalid email or password' 
            });
        }
        const deletedTokens = await prisma.refreshToken.deleteMany({
            where: { userId: user.id }
        });
        logger.info(`User ${user.id} logged out from all devices successfully, ${deletedTokens.count} refresh token(s) deleted`);
        return res.status(200).json({ message: 'Logout from all devices successful' });

    }catch(error){
        logger.error('Error during user logout from all devices:', error);
        return res.status(500).json({ 
            code: 'LOGOUT_ALL_ERROR_01',
            message: 'Internal server error' 
        });

    }
}