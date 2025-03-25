import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ICUServiceDTO,
              CreateICUServiceDTO 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ICUServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateICUServiceDTO): Promise<string> {
    try {
      const serviceID = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...iCUData } = data;
  
        const service = await tx.service.create({
          data: {
            type: "Intensive Care Unit",
            keywords: ["ICU"],
            facility : { 
              connect: { 
                facilityID 
              } 
            },

            ...((divisionID !== undefined) && {
              divisions: {
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
  
        await updateLogDAO.createUpdateLog(
          { entity: "Intensive Care Unit", action: Action.CREATE },
          facilityID,
          employeeID,
          tx
        );

        return service.serviceID;
      });
  
      return serviceID;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create AmbulanceService.");
    }
  }

  async getInformation(serviceID: string): Promise<ICUServiceDTO> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          serviceID 
        },
        include: { 
          service: { 
            select: { 
              divisionID : true, 
              updatedAt  : true, 
            } 
          } 
        }
      });
  
      if (!service) {
        throw new Error("Missing needed ICUService data.");
      }

      const { divisionID, updatedAt } = service.service;

      return {
        phoneNumber         : service.phoneNumber,
        baseRate            : service.baseRate,
        load                : service.load,
        availableBeds       : service.availableBeds,
        cardiacSupport      : service.cardiacSupport,
        neurologicalSupport : service.neurologicalSupport,
        renalSupport        : service.renalSupport,
        respiratorySupport  : service.respiratorySupport,
        updatedAt,

        ...(divisionID ? { divisionID } : {}),
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ICUService.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: ICUServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...iCUData } = data;

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

        await updateLogDAO.createUpdateLog(
          { entity: "Intensive Care Unit", action: Action.UPDATE },
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
