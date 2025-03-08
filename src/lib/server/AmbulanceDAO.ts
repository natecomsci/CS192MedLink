import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import type { AmbulanceServiceDTO, CreateAmbulanceServiceDTO } from "./DTOs";

export class AmbulanceServiceDAO {
  async create(facilityID: string, data: CreateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.service.create({
          data: {
            type     : "Ambulance", 
            facility : { connect: { facilityID } }
          }
        });

        await tx.ambulanceService.create({
          data: {
            ...data,
            service: { connect: { serviceID: service.serviceID } }
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create AmbulanceService.");
    }
  }

  async getInformation(serviceID: string): Promise<AmbulanceServiceDTO> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          serviceID 
        },
        include: { service: { select: { updatedAt: true } } }
      });

      if (!service) {
        throw new Error("Missing needed AmbulanceService data.");
      }

      return {
        phoneNumber       : service.phoneNumber,
        openingTime       : service.openingTime,
        closingTime       : service.closingTime,
        baseRate          : service.baseRate,
        minCoverageRadius : service.minCoverageRadius,
        mileageRate       : service.mileageRate,
        maxCoverageRadius : service.maxCoverageRadius,
        availability      : service.availability,
        updatedAt         : service.service.updatedAt,
      }

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for AmbulanceService.");
    }
  }

  async update(serviceID: string, data: AmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.ambulanceService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...data 
          }
        });

        const updatedAt: Date = new Date();

        const service = await tx.service.update({
          where: { 
            serviceID 
          },
          data: { 
            updatedAt: updatedAt 
          },
          select: { 
            facilityID: true
          }
        });

        await tx.facility.update({
          where: { 
            facilityID : service.facilityID 
          },
          data: { 
            updatedAt : updatedAt
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update AmbulanceService.");
    }
  }
}