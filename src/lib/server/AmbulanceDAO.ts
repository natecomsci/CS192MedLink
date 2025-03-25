import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { AmbulanceServiceDTO, 
              CreateAmbulanceServiceDTO 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class AmbulanceServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateAmbulanceServiceDTO): Promise<string> {
    try {
      const serviceID = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...ambulanceData } = data;
  
        const service = await tx.service.create({
          data: {
            type     : "Ambulance",
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

        await tx.ambulanceService.create({
          data: {
            ...ambulanceData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });

        await updateLogDAO.createUpdateLog(
          { entity: "Ambulance", action: Action.CREATE },
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

  async getInformation(serviceID: string): Promise<AmbulanceServiceDTO> {
    try {
      const service = await prisma.ambulanceService.findUnique({
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
        throw new Error("Missing needed AmbulanceService data.");
      }

      const { divisionID, updatedAt } = service.service;

      return {
        phoneNumber       : service.phoneNumber,
        openingTime       : service.openingTime,
        closingTime       : service.closingTime,
        baseRate          : service.baseRate,
        minCoverageRadius : service.minCoverageRadius,
        mileageRate       : service.mileageRate,
        maxCoverageRadius : service.maxCoverageRadius,
        availability      : service.availability,
        updatedAt,

        ...(divisionID ? { divisionID } : {}),
      };      

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for AmbulanceService.");
    }
  }

  async update(serviceID: string, facilityID: string, employeeID: string, data: AmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...ambulanceData } = data;

        await tx.ambulanceService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...ambulanceData 
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
          { entity: "Ambulance", action: Action.UPDATE },
          facilityID,
          employeeID,
          tx
        );
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update AmbulanceService.");
    }
  }
}