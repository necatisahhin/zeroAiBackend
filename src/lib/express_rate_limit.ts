import {rateLimit} from 'express-rate-limit';
import { error } from 'node:console';

const limiter = rateLimit({
    windowMs: 60000, // 1 minute
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message:{
        error: "Too many requests, please try again later."
    }
});

export default limiter;