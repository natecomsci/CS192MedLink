import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { BloodTypeMappingDTO, 
              BloodBankServiceDTO,
              CreateBloodBankServiceDTO 
            } from "./DTOs";

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();
            
export class BloodTypeMappingDAO {
  async getBloodTypeMapping(serviceID: string): Promise<BloodTypeMappingDTO | null> {
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
        console.warn("No BloodTypeMapping found in the facility.");
        return null;
      }
  
      return bloodTypeMapping;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get BloodTypeMapping.");
    }
  }

  async createBloodTypeMapping(serviceID: string, tx: Prisma.TransactionClient): Promise<void> {
    await tx.bloodTypeMapping.create({
      data: {  
        BloodBankService: {
          connect: {
            serviceID
          }
        }
      }
    });
  }

  async updateBloodTypeMapping(serviceID: string, data: BloodTypeMappingDTO, tx: Prisma.TransactionClient): Promise<void> {
    await tx.bloodTypeMapping.update({
      where: { 
        serviceID 
      },
      data: {
        A_P  : data.A_P,
        A_N  : data.A_N,
        B_P  : data.B_P,
        B_N  : data.B_N,
        O_P  : data.O_P,
        O_N  : data.O_N,
        AB_P : data.AB_P,
        AB_N : data.AB_N,
      }
    });
  }
}

let bloodTypeMappingDAO: BloodTypeMappingDAO = new BloodTypeMappingDAO();

export class BloodBankServiceDAO {
  async create(facilityID: string, employeeID: string, data: CreateBloodBankServiceDTO): Promise<string> {
    try {
      const serviceID = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, ...bloodBankData } = data;
  
        const service = await tx.service.create({
          data: {
            type: "Blood Bank",
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

        await tx.bloodBankService.create({
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
  
        await updateLogDAO.createUpdateLog(
          { entity: "Blood Bank", action: Action.CREATE },
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

  async getInformation(serviceID: string): Promise<BloodBankServiceDTO> {
    try {
      const [service, bloodTypeAvailability] = await Promise.all([
        prisma.bloodBankService.findUnique({
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
        }),
        bloodTypeMappingDAO.getBloodTypeMapping(serviceID)
      ]);

      if (!service) {
        throw new Error("Missing needed BloodBankService data.");
      }
    
      if (!bloodTypeAvailability) {
        throw new Error("Missing needed BloodTypeAvailability data.");
      }

      const { divisionID, updatedAt } = service.service;

      return {
        phoneNumber           : service.phoneNumber,
        openingTime           : service.openingTime,
        closingTime           : service.closingTime,
        pricePerUnit          : service.pricePerUnit,
        turnaroundTimeD       : service.turnaroundTimeD,
        turnaroundTimeH       : service.turnaroundTimeH,
        bloodTypeAvailability : bloodTypeAvailability,
        updatedAt,

        ...(divisionID ? { divisionID } : {}),
      }; 

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for BloodBankService.");
    }
  }

  async update(serviceID: string, facilityID: string, employeeID: string, data: BloodBankServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { divisionID, bloodTypeAvailability, ...bloodBankData } = data;

        await tx.ambulanceService.update({
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
          { entity: "Blood Bank", action: Action.UPDATE },
          facilityID,
          employeeID,
          tx
        );
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update BloodBankService.");
    }
  }
}