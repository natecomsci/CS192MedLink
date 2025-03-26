import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ERServiceDTO,
              CreateERServiceDTO 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ERServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateERServiceDTO): Promise<string> {
    try {
      const serviceID = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...eRData } = data;
  
        const service = await tx.service.create({
          data: {
            type: "Emergency Room",
            keywords: ["ER"],
            facility : { 
              connect: { 
                facilityID 
              } 
            },

            ...((divisionID !== undefined) && {
              division: {
                connect: { 
                  divisionID 
                }
              }
            })
          }
        });

        await tx.eRService.create({
          data: {
            ...eRData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });
  
        await updateLogDAO.createUpdateLog(
          {
            entity: "Emergency Room",
            action: Action.CREATE,
            ...(divisionID && { divisionID })
          },
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

  async getInformation(serviceID: string): Promise<ERServiceDTO> {
    try {
      const service = await prisma.eRService.findUnique({
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
        throw new Error("Missing needed ERService data.");
      }

      const { divisionID, updatedAt } = service.service;
  
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
        updatedAt,

        ...(divisionID ? { divisionID } : {}),
      }; 

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for ERService.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: ERServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...eRData } = data;

        await tx.eRService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...eRData 
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
          {
            entity: "Emergency Room",
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
      throw new Error("Could not update ERService.");
    }
  }
}