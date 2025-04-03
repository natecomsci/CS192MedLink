import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { OutpatientServiceDTO,
              CreateOutpatientServiceDTO,
              UpdateOutpatientServiceDTO,
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class OutpatientServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateOutpatientServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { type, divisionID, note, ...outpatientData } = data;
  
        const service = await tx.service.create({
          data: {
            type,
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

        await tx.outpatientService.create({
          data: {
            ...outpatientData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });
  
        await updateLogDAO.create(
          {
            entity: type,
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
      throw new Error("Could not create OutpatientService.");
    }
  }

  async getInformation(serviceID: string): Promise<OutpatientServiceDTO> {
    try {
      const service = await prisma.outpatientService.findUnique({
        where: {
          serviceID,
        },
        include: {
          // tinamad
          service: {
            select: {
              note: true,
              division: {
                select: {
                  divisionID: true,
                  name: true,
                },
              },
              updatedAt: true,
              type: true,
            }
          }
        }
      });
  
      if (!service) {
        throw new Error("Missing needed OutpatientService data.");
      }

      const { note, division, updatedAt, type } = service.service;

      return {
        type,
        basePrice       : service.basePrice,
        completionTimeD : service.completionTimeD,
        completionTimeH : service.completionTimeH,
        isAvailable     : service.isAvailable,
        acceptsWalkIns  : service.acceptsWalkIns,
        updatedAt,

        ...(note ? { note } : {}),

        ...(division ? { division } : {})
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for OutpatientService.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateOutpatientServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...outpatientData } = data;

        await tx.outpatientService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...outpatientData 
          },
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
            facilityID : true,
            type       : true,
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

        if (!service) {
          throw new Error("OutpatientService not found.");
        }

        await updateLogDAO.create(
          {
            entity: service.type,
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
      throw new Error("Could not update OutpatientService.");
    }
  }
}
