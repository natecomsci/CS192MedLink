import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { ContactType, Action }  from "@prisma/client";

import { getGeneralServiceInfo } from "./dataLayerUtility";

import { ContactDAO } from "./ContactDAO";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ICUServiceDTO,
              CreateICUServiceDTO,
              UpdateICUServiceDTO, 
            } from "./DTOs";

const contactDAO: ContactDAO = new ContactDAO();

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ICUServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateICUServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, phoneNumber, ...iCUData } = data;

        // 1. Create base Service.

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

        // 2. Create ICUService.

        const iCUService = await tx.iCUService.create({
          data: {
            ...iCUData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });

        // 3. Link Phone Numbers.

        if (phoneNumber && phoneNumber.length > 0) {  
          for (const number of phoneNumber) {
            await contactDAO.create(
              {
                info      : number,
                type      : ContactType.PHONE,
                serviceID : service.serviceID
              },
              tx
            );
          }
        }

        // 4. Log the creation.

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

        console.log(`Created ICU Service ${service.serviceID}: `, {service, iCUService});

        return service.serviceID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getInformation(serviceID: string): Promise<ICUServiceDTO> {
    try {
      const service = await prisma.iCUService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        throw new Error(`No ICU Service linked to ID ${serviceID} found.`);
      }

      const { note, phoneNumbers, division, updatedAt } = await getGeneralServiceInfo(serviceID);

      console.log(`Fetched information of ICU Service ${serviceID}: `);

      return {
        load                : service.load,
        baseRate            : service.baseRate,
        availableBeds       : service.availableBeds,
        cardiacSupport      : service.cardiacSupport,
        neurologicalSupport : service.neurologicalSupport,
        renalSupport        : service.renalSupport,
        respiratorySupport  : service.respiratorySupport,
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

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateICUServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...iCUData } = data;

        const iCUService = await tx.iCUService.update({
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

        console.log(`Updated ICU Service ${serviceID}: `, iCUService);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}