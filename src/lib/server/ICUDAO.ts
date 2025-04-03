import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { otherServiceInfo } from "./dataLayerUtility";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ICUServiceDTO,
              CreateICUServiceDTO,
              UpdateICUServiceDTO, 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ICUServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateICUServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...iCUData } = data;
  
        const service = await tx.service.create({
          data: {
            type: "Intensive Care Unit",
            keywords: ["ICU"],
            facility : { 
              connect: { 
                facilityID 
              } 
            },

            ...((note !== undefined) && {
              note
            }),

            ...((divisionID !== undefined) && {
              division: {
                connect: { 
                  divisionID 
                }
              }
            })
          }
        });

        await tx.iCUService.create({
          data: {
            ...iCUData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });
  
        await updateLogDAO.create(
          {
            entity: "Intensive Care Unit",
            action: Action.CREATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        return service.serviceID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create ICU Service.");
    }
  }

  async getInformation(serviceID: string): Promise<ICUServiceDTO> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          serviceID 
        },
        include: otherServiceInfo
      });
  
      if (!service) {
        throw new Error("Missing needed ICUService data.");
      }

      const { note, division, updatedAt } = service.service;

      return {
        load                : service.load,
        baseRate            : service.baseRate,
        availableBeds       : service.availableBeds,
        cardiacSupport      : service.cardiacSupport,
        neurologicalSupport : service.neurologicalSupport,
        renalSupport        : service.renalSupport,
        respiratorySupport  : service.respiratorySupport,
        updatedAt,

        ...(service.phoneNumber ? { phoneNumber: service.phoneNumber } : {}),

        ...(service.openingTime ? { openingTime: service.openingTime } : {}),

        ...(service.closingTime ? { closingTime: service.closingTime } : {}),

        ...(note ? { note } : {}),

        ...(division ? { division } : {})
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ICUService.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateICUServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...iCUData } = data;

        await tx.iCUService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...iCUData 
          }
        });

        const updatedAt: Date = new Date();

        const serviceUpdateData = {
          updatedAt,
          ...((note !== undefined) && {
            note
          }),

          ...((divisionID !== undefined) && {
            division: { 
              connect: { 
                divisionID 
              } 
            }
          })
        };
        
        const service = await tx.service.update({
          where: { 
            serviceID 
          },
          data: serviceUpdateData,
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

        await updateLogDAO.create(
          {
            entity: "Intensive Care Unit",

            action: Action.UPDATE,
            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update ICUService.");
    }
  }
}
