import { PrismaClient } from '@prisma/client'

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
 }

export { prisma }
 
export function getServices(facility: string, serviceType: string) {
  return prisma.findMany()
}