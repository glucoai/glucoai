import Redis from 'ioredis';
import { env } from '../config/env.js';

const redis = new Redis(env.URL_REDIS);

export { redis };
