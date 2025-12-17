import winston from 'winston';
import { config } from '@/config/config';

const { combine, timestamp, printf, colorize, errors, align } = winston.format;

const transports: winston.transport[] = [];

if (config.mode === 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                errors({ stack: true }),
                align(),
                printf(({ level, message, timestamp, stack }) => {
                    return `${timestamp} [${level}]: ${stack || message}`;
                })
            )
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    );
} else {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                errors({ stack: true }),
                align(),
                printf(({ level, message, timestamp, stack }) => {
                    return `${timestamp} [${level}]: ${stack || message}`;
                })
            )
        })
    );
}

const logger = winston.createLogger({
    level: config.logLevel,
    transports
});

export default logger;