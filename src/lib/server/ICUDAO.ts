import { prisma } from "./prisma";

import type { ICUService, Prisma } from '@prisma/client';

import type { CreateICUServiceDTO, 
              ICUServiceDTO 
            } from './DTOs';


export class ICUServiceDAO {
  async getByID(serviceID: string): Promise<ICUService | null> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No ICUService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ICUService.");
    }
  }

  async getByFacility(facilityID: string): Promise<ICUService | null> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No ICUService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ICUService.");
    }
  }

  async create(facilityID: string, data: CreateICUServiceDTO): Promise<void> {
    try {
      await prisma.iCUService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ICUService.");
    }
  }

  async getInformation(serviceID: string): Promise<ICUServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed ICUService data.");
      }
  
      return {
        phoneNumber         : service.phoneNumber,
        baseRate            : service.baseRate,
        load                : service.load,
        availableBeds       : service.availableBeds,
        cardiacSupport      : service.cardiacSupport,
        neurologicalSupport : service.neurologicalSupport,
        renalSupport        : service.renalSupport,
        respiratorySupport  : service.respiratorySupport,
        updatedAt           : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ICUService.");
    }
  }  

  async update(serviceID: string, data: ICUServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.iCUService.update({
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
      throw new Error("Could not update ICUService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.iCUService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete ICUService.");
    }
  }
}
