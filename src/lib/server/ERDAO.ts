import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { otherServiceInfo } from "./dataLayerUtility";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ERServiceDTO,
              CreateERServiceDTO,
              UpdateERServiceDTO, 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ERServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateERServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...eRData } = data;
  
        const service = await tx.service.create({
          data: {
            type: "Emergency Room",
            keywords: ["ER"],
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

        const eRService = await tx.eRService.create({
          data: {
            ...eRData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });
  
        await updateLogDAO.create(
          {
            entity: "Emergency Room",
            action: Action.CREATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Created ER Service ${service.serviceID}: `, {service, eRService});

        return service.serviceID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  } 

  async getInformation(serviceID: string): Promise<ERServiceDTO> {
    try {
      const service = await prisma.eRService.findUnique({
        where: { 
          serviceID 
        },
        include: otherServiceInfo
      });
  
      if (!service) {
        throw new Error(`No ER Service linked to ID ${serviceID} found.`);
      }

      const { note, division, updatedAt } = service.service;

      console.log(`Fetched information of ER Service ${serviceID}: `);

      return {
        load                 : service.load,
        availableBeds        : service.availableBeds,
        nonUrgentPatients    : service.nonUrgentPatients,
        nonUrgentQueueLength : service.nonUrgentQueueLength,
        urgentPatients       : service.urgentPatients,
        urgentQueueLength    : service.urgentQueueLength,
        criticalPatients     : service.criticalPatients,
        criticalQueueLength  : service.criticalQueueLength,
        updatedAt,

        ...(service.phoneNumber ? { phoneNumber: service.phoneNumber } : {}),

        ...(service.openingTime ? { openingTime: service.openingTime } : {}),

        ...(service.closingTime ? { closingTime: service.closingTime } : {}),

        ...(note ? { note } : {}),

        ...(division ? { division } : {})
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateERServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...eRData } = data;

        const eRService = await tx.eRService.update({
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
            entity: "Emergency Room",
            action: Action.UPDATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Updated ER Service ${serviceID}: `, eRService);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}