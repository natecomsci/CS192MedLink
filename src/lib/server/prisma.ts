import { PrismaClient } from '@prisma/client'

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
 }
 
export { prisma }

export async function getAmbulanceService(id: string) {
  const ambulanceService = await prisma.AmbulanceService.findUnique({
    where: { facilityID: id },
    select: {
      phoneNumber: true,
      openingTime: true,
      closingTime: true,
      baseRate: true,
      minCoverageRadius: true,
      mileageRate: true,
      maxCoverageRadius: true,
      availability: true,
    },
  });
  return { feed: ambulanceService }
}