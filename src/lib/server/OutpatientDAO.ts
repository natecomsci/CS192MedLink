import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import type { CreateOutpatientServiceDTO, OutpatientServiceDTO } from "./DTOs";

export class OutpatientServiceDAO {
  async create(facilityID: string, data: CreateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.service.create({
          data: {
            type     : data.serviceType, 
            facility : { connect: { facilityID } }
          }
        });

        await tx.outpatientService.create({
          data: {
            price           : data.price,
            completionTimeD : data.completionTimeD,
            completionTimeH : data.completionTimeH,
            acceptsWalkIns  : data.acceptsWalkIns,

            service: { connect: { serviceID: service.serviceID } }
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create OutpatientService.");
    }
  }

  async getInformation(serviceID: string): Promise<OutpatientServiceDTO> {
    try {
      const service = await prisma.outpatientService.findUnique({
        where: { 
          serviceID 
        },
        include: { service: { select: { updatedAt: true } } }
      });
  
      if (!service) {
        throw new Error("Missing needed OutpatientService data.");
      }
  
      return {
        price           : service.price,
        completionTimeD : service.completionTimeD,
        completionTimeH : service.completionTimeH,
        isAvailable     : service.isAvailable,
        acceptsWalkIns  : service.acceptsWalkIns,
        updatedAt       : service.service.updatedAt,
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for OutpatientService.");
    }
  }  

  async update(serviceID: string, data: OutpatientServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.outpatientService.update({
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
      throw new Error("Could not update OutpatientService.");
    }
  }
}
