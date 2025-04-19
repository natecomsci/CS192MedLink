import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { ContactType, Action }  from "@prisma/client";

import { getGeneralServiceInfo } from "./dataLayerUtility";

import { ContactDAO } from "./ContactDAO";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ERServiceDTO,
              CreateERServiceDTO,
              UpdateERServiceDTO, 
            } from "./DTOs";

const contactDAO: ContactDAO = new ContactDAO();

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ERServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateERServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, phoneNumber, ...eRData } = data;

        // 1. Create base Service.

        const { serviceID } = await tx.service.create({
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

        // 2. Create ERService.

        const eRService = await tx.eRService.create({
          data: {
            ...eRData,
            service: { 
              connect: { 
                serviceID: serviceID 
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
            entity: "Emergency Room",
            action: Action.CREATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Created ER Service ${serviceID}: `, eRService);

        return serviceID;
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
        }
      });
  
      if (!service) {
        throw new Error(`No ER Service linked to ID ${serviceID} found.`);
      }

      const { note, phoneNumbers, division, updatedAt } = await getGeneralServiceInfo(serviceID);

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

        ...(service.openingTime ? { openingTime: service.openingTime } : {}),

        ...(service.closingTime ? { closingTime: service.closingTime } : {}),

        ...(note ? { note: note } : {}), // redundant pero ayaw ni TypeScript ang ginagawa ko at tinatamad akong ayusin

        ...(phoneNumbers.length ? { phoneNumbers: phoneNumbers } : {}),

        ...(division ? { division: division } : {})
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }  

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateERServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, phoneNumber, ...eRData } = data;

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

        // phoneNumber = [] means delete everything

        if (phoneNumber !== undefined) {
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