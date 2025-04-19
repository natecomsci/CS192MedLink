import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { ContactType, Action }  from "@prisma/client";

import { getGeneralServiceInfo } from "./dataLayerUtility";

import { ContactDAO } from "./ContactDAO";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { AmbulanceServiceDTO, 
              CreateAmbulanceServiceDTO,
              UpdateAmbulanceServiceDTO, 
            } from "./DTOs";

const contactDAO: ContactDAO = new ContactDAO();

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class AmbulanceServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateAmbulanceServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, phoneNumber, ...ambulanceData } = data;
  
        // 1. Create base Service.

        const { serviceID } = await tx.service.create({
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

        // 2. Create AmbulanceService.

        const ambulanceService = await tx.ambulanceService.create({
          data: {
            ...ambulanceData,
            service: { 
              connect: { 
                serviceID
              } 
            }
          }
        });

        // 3. Link Phone Numbers.

        if (phoneNumber && phoneNumber.length) {
          await contactDAO.createMany(
            "service",
            serviceID,
            phoneNumber.map((info) => ({
              info,
              type: ContactType.PHONE
            })),
            tx
          );
        }

        // 4. Log the creation.

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

        console.log(`Created Ambulance Service ${serviceID}: `, ambulanceService);

        return serviceID;
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
        }
      });

      if (!service) {
        throw new Error(`No Ambulance Service linked to ID ${serviceID} found.`);
      }

      const { note, phoneNumbers, division, updatedAt } = await getGeneralServiceInfo(serviceID);

      console.log(`Fetched information of Ambulance Service ${serviceID}: `);

      return {
        availability      : service.availability,
        baseRate          : service.baseRate,
        minCoverageRadius : service.minCoverageRadius,
        mileageRate       : service.mileageRate,
        maxCoverageRadius : service.maxCoverageRadius,
        updatedAt,

        ...(service.openingTime ? { openingTime: service.openingTime } : {}),

        ...(service.closingTime ? { closingTime: service.closingTime } : {}),

        ...(note ? { note: note } : {}), // redundant pero ayaw ni TypeScript ang ginagawa ko at tinatamad akong ayusin

        ...(phoneNumbers.length ? { phoneNumber: phoneNumbers } : {}),

        ...(division ? { division: division } : {})
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, phoneNumber, ...ambulanceData } = data;

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

        // phoneNumber = [] means delete everything

        if (phoneNumber) {
          await contactDAO.deleteMany("service", serviceID, tx);
  
          if (phoneNumber.length > 0) {
            await contactDAO.createMany(
              "service",
              serviceID,
              phoneNumber.map((info) => ({
                info,
                type: ContactType.PHONE
              })),
              tx
            );
          }
        }

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