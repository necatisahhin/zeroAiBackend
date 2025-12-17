import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import logger from '@/lib/winston';
import { config } from '@/config/config';

export const refresh = async (req: Request, res: Response) => {
    try {
        // Sadece refreshToken alanını kontrol et
        const allowedFields = ['refreshToken'];
        const receivedFields = Object.keys(req.body);
        const extraFields = receivedFields.filter(field => !allowedFields.includes(field));
        
        if (extraFields.length > 0) {
            return res.status(400).json({
                code: 'VALIDATION_ERROR',
                message: `Unexpected fields: ${extraFields.join(', ')}`
            });
        }

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ 
                code: 'REFRESH_ERROR_01',
                message: 'Refresh token is required' 
            });
        }

        // Refresh token'ı doğrula
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, config.jwtSecret) as { userId: string };
        } catch (error) {
            return res.status(401).json({ 
                code: 'REFRESH_ERROR_02',
                message: 'Invalid or expired refresh token' 
            });
        }

        // Refresh token'ın database'de olup olmadığını kontrol et
        const existingToken = await prisma.refreshToken.findFirst({
            where: { 
                token: refreshToken,
                userId: decoded.userId 
            }
        });

        if (!existingToken) {
            return res.status(401).json({ 
                code: 'REFRESH_ERROR_03',
                message: 'Refresh token not found' 
            });
        }

        // Yeni access token oluştur
        const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            config.jwtSecret,
            { expiresIn: '5h' }
        );

        // Yeni refresh token oluştur
        const newRefreshToken = jwt.sign(
            { userId: decoded.userId },
            config.jwtSecret,
            { expiresIn: '7d' }
        );

        // Eski refresh token'ı sil ve yenisini ekle
        await prisma.$transaction([
            prisma.refreshToken.delete({
                where: { id: existingToken.id }
            }),
            prisma.refreshToken.create({
                data: {
                    token: newRefreshToken,
                    userId: decoded.userId
                }
            })
        ]);

        logger.info(`Token refreshed for user: ${decoded.userId}`);

        return res.status(200).json({ 
            message: 'Token refreshed successfully',
            token: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        logger.error('Error during token refresh:', error);
        return res.status(500).json({ 
            code: 'REFRESH_ERROR_04',
            message: 'Internal server error' 
        });
    }
};
