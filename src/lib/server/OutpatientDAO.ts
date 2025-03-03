import { prisma } from "./prisma";

import { ServiceType } from '@prisma/client'

import type { OutpatientService, Prisma } from '@prisma/client';

import type { CreateOutpatientServiceDTO,
              OutpatientServiceDTO 
            } from './DTOs';

export class OutpatientServiceDAO {
  async getByID(serviceID: string): Promise<OutpatientService | null> {
    try {
      const service = await prisma.outpatientService.findUnique({
        where: { 
          serviceID
        }
      });
  
      if (!service) {
        console.warn("No OutpatientService with the specified ID found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get OutpatientService.");
    }
  }

  async getByFacility(facilityID: string): Promise<OutpatientService[]> {
    try {
      const outpatientServices = await prisma.outpatientService.findMany({
         where: { 
          facilityID 
        }
      });

      return outpatientServices;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get OutpatientServices.");
    }
  }

  async create(facilityID: string, data: CreateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.outpatientService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create OutpatientService.");
    }
  }

  async getInformation(serviceID: string): Promise<OutpatientServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed OutpatientService data.");
      }
  
      return {
        serviceType     : service.serviceType,
        price           : service.price,
        completionTimeD : service.completionTimeD,
        completionTimeH : service.completionTimeH,
        isAvailable     : service.isAvailable,
        acceptsWalkIns  : service.acceptsWalkIns,
        updatedAt       : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for OutpatientService.");
    }
  }  

  async update(serviceID: string, data: OutpatientServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.outpatientService.update({
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
      throw new Error("Could not update OutpatientService.");
    }
  }

  async delete(serviceID: string, serviceType: ServiceType): Promise<void> {
    try {
      await prisma.outpatientService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete OutpatientService.");
    }
  }
}
