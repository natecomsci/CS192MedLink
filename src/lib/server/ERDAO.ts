import { prisma } from "./prisma";

import type { ERService, Prisma } from '@prisma/client';

import type { CreateERServiceDTO,
              ERServiceDTO 
            } from './DTOs';

export class ERServiceDAO {
  async getByID(serviceID: string): Promise<ERService | null> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No ERService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ERService.");
    }
  }

  async getByFacility(facilityID: string): Promise<ERService | null> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No ERService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get ERService.");
    }
  }
  
  async create(facilityID: string, data: CreateERServiceDTO): Promise<void> {
    try {
      await prisma.eRService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ERService.");
    }
  }

  async getInformation(serviceID: string): Promise<ERServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed ERService data.");
      }
  
      return {
        phoneNumber          : service.phoneNumber,
        load                 : service.load,
        availableBeds        : service.availableBeds,
        nonUrgentPatients    : service.nonUrgentPatients,
        nonUrgentQueueLength : service.nonUrgentQueueLength,
        urgentPatients       : service.urgentPatients,
        urgentQueueLength    : service.urgentQueueLength,
        criticalPatients     : service.criticalPatients,
        criticalQueueLength  : service.criticalQueueLength,
        updatedAt            : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ERService.");
    }
  }  

  async update(serviceID: string, data: ERServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.eRService.update({
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
      throw new Error("Could not update ERService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.eRService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete ERService.");
    }
  }
}
