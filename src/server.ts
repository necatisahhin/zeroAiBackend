import express from 'express';
import { config } from './config/config';
import logger from './lib/winston';

import cors from 'cors';
import helmet from 'helmet';
import limiter from './lib/express_rate_limit';

import routerV1 from './routes/v1/index';

import prisma from './lib/prisma';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(helmet());

app.use(limiter);

if (config.mode !== 'development') {
  const corsOptions = {
    origin: '*',
    credentials: true
  };
  app.use(cors(corsOptions));
}

(async () => {
  try {
    app.use('/api/v1', routerV1);

    app.listen(config.port, () => {
      try{
        prisma.$connect();
        logger.info('Connected to the database successfully.');
      }catch(error){
        logger.error('Database connection error:', error);
      }
      logger.info(`Server is running on port ${config.port} in ${config.mode} mode.`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
})();

const handleShutdown = () => {
try {
    logger.info('Server is shutting down gracefully...');
    process.exit(0);
} catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
}
}

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
