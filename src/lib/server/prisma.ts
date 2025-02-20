import { PrismaClient } from '@prisma/client'

import { ServiceType } from '@prisma/client'

import type { Region, POrC, COrM, Brgy, Address } from '@prisma/client';

import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './dtos';

// Initialization of Prisma

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DAOs