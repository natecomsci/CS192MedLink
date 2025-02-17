import { PrismaClient } from '@prisma/client'

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
 }
 
export { prisma }

export async function getAmbulanceService(id: string) {
  const ambulanceService = await prisma.ambulanceService.findUnique({
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

// export async function getBloodTypeService(id: string) {
//   const bloodTypeService = await prisma.bloodBankService.findUnique({
//     relationLoadStrategy: 'join', // or 'query'
//     where: { facilityID: id },
//     select: {
//       phoneNumber: true,
//       openingTime: true,
//       closingTime: true,
//       pricePerUnit: true,
//       turnaroundTimeD: true,
//       turnaroundTimeH: true,
//       A_P: true,
//     },
//     include: {
//       bloodTypeAvailability: true
//     }
//   });
//   return { feed: bloodTypeService }
// }