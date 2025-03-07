import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import type { CreateERServiceDTO, ERServiceDTO } from "./dtos";

export class ERServiceDAO {
  async create(facilityID: string, data: CreateERServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.service.create({
          data: {
            type     : "Emergency Room",
            keywords : ["ER"],
            facility : { connect: { facilityID } }
          }
        });

        await tx.eRService.create({
          data: {
            ...data,
            service: { connect: { serviceID: service.serviceID } }
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ERService.");
    }
  }

  async getInformation(serviceID: string): Promise<ERServiceDTO> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { 
          serviceID 
        },
        include: { service: { select: { updatedAt: true } } }
      });
  
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
        updatedAt            : service.service.updatedAt,
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ERService.");
    }
  }  

  async update(serviceID: string, data: ERServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.eRService.update({
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
            facilityID
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
      throw new Error("Could not update ERService.");
    }
  }
}