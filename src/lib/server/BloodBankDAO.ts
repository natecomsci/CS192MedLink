import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { otherServiceInfo } from "./dataLayerUtility";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { BloodTypeMappingDTO, 
              BloodBankServiceDTO,
              CreateBloodBankServiceDTO,
              UpdateBloodBankServiceDTO, 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();
            
export class BloodTypeMappingDAO {
  async getBloodTypeMapping(serviceID: string): Promise<BloodTypeMappingDTO> {
    try {
      const bloodTypeMapping = await prisma.bloodTypeMapping.findUnique({
        where: { 
          serviceID 
        },
        select: {
          A_P  : true,
          A_N  : true,
          B_P  : true,
          B_N  : true,
          O_P  : true,
          O_N  : true,
          AB_P : true,
          AB_N : true,
        }
      });
  
      if (!bloodTypeMapping) {
        throw new Error(`No Blood Type Mapping linked to Service ${serviceID} found.`);
      }
  
      return bloodTypeMapping;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async createBloodTypeMapping(serviceID: string, tx: Prisma.TransactionClient): Promise<void> {
    try {
      const mapping = await tx.bloodTypeMapping.create({
        data: {  
          BloodBankService: {
            connect: {
              serviceID
            }
          }
        }
      });

      console.log(`Created Blood Type Mapping ${mapping.serviceID}: `, mapping);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async updateBloodTypeMapping(serviceID: string, data: BloodTypeMappingDTO, tx: Prisma.TransactionClient): Promise<void> {
    try {
      const mapping = await tx.bloodTypeMapping.update({
        where: { 
          serviceID 
        },
        data
      });

      console.log(`Updated Blood Type Mapping ${serviceID}: `, mapping);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}

let bloodTypeMappingDAO: BloodTypeMappingDAO = new BloodTypeMappingDAO();

export class BloodBankServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateBloodBankServiceDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, ...bloodBankData } = data;
  
        const service = await tx.service.create({
          data: {
            type: "Blood Bank",
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

        const bloodBankService = await tx.bloodBankService.create({
          data: {
            ...bloodBankData,
            service: { 
              connect: { 
                serviceID: service.serviceID 
              } 
            }
          }
        });
  
        await bloodTypeMappingDAO.createBloodTypeMapping(service.serviceID, tx);
  
        await updateLogDAO.create(
          {
            entity: "Blood Bank",
            action: Action.CREATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Created Blood Bank Service ${service.serviceID}: `, {service, bloodBankService});

        return service.serviceID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getInformation(serviceID: string): Promise<BloodBankServiceDTO> {
    try {
      const [service, bloodTypeAvailability] = await Promise.all([
        prisma.bloodBankService.findUnique({
          where: { 
            serviceID 
          },
          include: otherServiceInfo
        }),
        bloodTypeMappingDAO.getBloodTypeMapping(serviceID)
      ]);

      if (!service) {
        throw new Error(`No Service linked to ID ${serviceID} found.`);
      }
    
      if (!bloodTypeAvailability) {
        throw new Error(`No Blood Type Mapping linked to Service ${serviceID} found.`);
      }

      const { note, division, updatedAt } = service.service;

      console.log(`Fetched information of Blood Bank Service ${serviceID}: `);

      return {
        basePricePerUnit      : service.basePricePerUnit,
        turnaroundTimeD       : service.turnaroundTimeD,
        turnaroundTimeH       : service.turnaroundTimeH,
        bloodTypeAvailability : bloodTypeAvailability,
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

  async update(serviceID: string, facilityID: string, employeeID: string, data: UpdateBloodBankServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, note, bloodTypeAvailability, ...bloodBankData } = data;

        const bloodBankService = await tx.bloodBankService.update({
          where: { 
            serviceID 
          },
          data: { 
            ...bloodBankData 
          }
        });

        if (bloodTypeAvailability) {
          await bloodTypeMappingDAO.updateBloodTypeMapping(serviceID, bloodTypeAvailability, tx);
        }

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
            entity: "Blood Bank",
            action: Action.UPDATE,

            ...(divisionID && { divisionID })
          },
          facilityID,
          employeeID,
          tx
        );

        console.log(`Updated Blood Bank Service ${serviceID}: `, bloodBankService);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}