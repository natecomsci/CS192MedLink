import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { OutpatientServiceDTO,
              CreateOutpatientServiceDTO 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class OutpatientServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateOutpatientServiceDTO): Promise<string> {
    try {
      const serviceID = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { serviceType, divisionID, ...outpatientData } = data;
  
        const service = await tx.service.create({
          data: {
            type: serviceType,
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
  
        await updateLogDAO.createUpdateLog(
          { entity: serviceType, action: Action.CREATE },
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

  async getInformation(serviceID: string): Promise<OutpatientServiceDTO> {
    try {
      const service = await prisma.outpatientService.findUnique({
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
        throw new Error("Missing needed OutpatientService data.");
      }

      const { divisionID, updatedAt } = service.service;

      return {
        price           : service.price,
        completionTimeD : service.completionTimeD,
        completionTimeH : service.completionTimeH,
        isAvailable     : service.isAvailable,
        acceptsWalkIns  : service.acceptsWalkIns,
        updatedAt,

        ...(divisionID ? { divisionID } : {}),
      };

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for OutpatientService.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: OutpatientServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...outpatientData } = data;

        await tx.outpatientService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...outpatientData 
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

        const outpatientService = await tx.service.findUnique({
          where: { 
            serviceID 
          },
          select: { 
            type: true 
          }
        });

        if (!outpatientService) {
          throw new Error("OutpatientService not found.");
        }

        await updateLogDAO.createUpdateLog(
          { entity: outpatientService.type, action: Action.UPDATE },
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
