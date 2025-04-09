import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { otherServiceInfo } from "./dataLayerUtility";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { AmbulanceServiceDTO, 
              CreateAmbulanceServiceDTO,
              UpdateAmbulanceServiceDTO, 
            } from "./DTOs";

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class AmbulanceServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateAmbulanceServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...ambulanceData } = data;
  
        const service = await tx.service.create({
          data: {
            type     : "Ambulance",
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

        const ambulanceService = await tx.ambulanceService.create({
          data: {
            ...ambulanceData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });

        await updateLogDAO.create(
          {
            entity: "Ambulance",
            action: Action.CREATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Created Ambulance Service ${service.serviceID}: `, {service, ambulanceService});

        return service.serviceID;
      });
      } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getInformation(serviceID: string): Promise<AmbulanceServiceDTO> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          serviceID 
        },
        include: otherServiceInfo
      });

      if (!service) {
        throw new Error(`No Ambulance Service linked to ID ${serviceID} found.`);
      }

      const { note, division, updatedAt } = service.service;

      console.log(`Fetched information of Ambulance Service ${serviceID}: `);

      return {
        availability      : service.availability,
        baseRate          : service.baseRate,
        minCoverageRadius : service.minCoverageRadius,
        mileageRate       : service.mileageRate,
        maxCoverageRadius : service.maxCoverageRadius,
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

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...ambulanceData } = data;

        const ambulanceService = await tx.ambulanceService.update({
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
            entity: "Ambulance",
            action: Action.UPDATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Updated Ambulance Service ${serviceID}: `, ambulanceService);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}