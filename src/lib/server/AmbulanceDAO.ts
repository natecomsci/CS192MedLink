import { prisma } from "./prisma";

import type { AmbulanceService, Prisma } from '@prisma/client';

import type { AmbulanceServiceDTO, 
              CreateAmbulanceServiceDTO 
            } from './DTOs';

// DAOs
export class AmbulanceServiceDAO {
  async getByID(serviceID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No AmbulanceService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async getByFacility(facilityID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No AmbulanceService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async create(facilityID: string, data: CreateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create AmbulanceService.");
    }
  }

  async getInformation(serviceID: string): Promise<AmbulanceServiceDTO> {
    try {
      const service = await this.getByID(serviceID);

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
        updatedAt         : service.updatedAt,
      }

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for AmbulanceService.");
    }
  }

  async update(serviceID: string, data: AmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.ambulanceService.update({
          where: { 
            serviceID 
          },
          data: { ...data },
          select: {
            facilityID : true,
            updatedAt  : true,
          }
        });
  
        await prisma.facility.update({
          where: { 
            facilityID : service.facilityID 
          },
          data: { 
            updatedAt : service.updatedAt
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update AmbulanceService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.ambulanceService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete AmbulanceService.");
    }
  }
}
