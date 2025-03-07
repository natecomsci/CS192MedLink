import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import type { CreateICUServiceDTO, ICUServiceDTO } from "./dtos";

export class ICUServiceDAO {
  async create(facilityID: string, data: CreateICUServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.service.create({
          data: {
            type     : "Intensive Care Unit",
            keywords : ["ICU"],
            facility : { connect: { facilityID } }
          }
        });

        await tx.iCUService.create({
          data: {
            ...data,
            service: { connect: { serviceID: service.serviceID } }
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ICUService.");
    }
  }

  async getInformation(serviceID: string): Promise<ICUServiceDTO> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          serviceID 
        },
        include: { service: { select: { updatedAt: true } } }
      });
  
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
        updatedAt           : service.service.updatedAt,
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ICUService.");
    }
  }  

  async update(serviceID: string, data: ICUServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.iCUService.update({
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
      throw new Error("Could not update ICUService.");
    }
  }
}
