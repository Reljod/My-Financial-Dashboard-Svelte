import { REDIS_URL } from '$env/static/private';
import Redis from 'ioredis';

const redis = REDIS_URL ? new Redis(REDIS_URL) : new Redis();

export default redis;
