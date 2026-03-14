import Redis from 'ioredis';
import { env } from '../config/env';

const redis = new Redis(env.URL_REDIS);

export { redis };
