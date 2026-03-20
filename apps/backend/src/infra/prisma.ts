import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';

const prisma = new PrismaClient({ datasourceUrl: env.URL_BANCO });

export { prisma };
