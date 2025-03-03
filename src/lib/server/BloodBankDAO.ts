import { prisma } from "./prisma";

import { Prisma, 
         type BloodBankService 
       } from '@prisma/client'

import type { BloodTypeMappingDTO,
              CreateBloodBankServiceDTO,
              BloodBankServiceDTO 
            } from './DTOs';

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
        A_P  : false,
        A_N  : false,
        B_P  : false,
        B_N  : false,
        O_P  : false,
        O_N  : false,
        AB_P : false,
        AB_N : false,
  
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
  async getByID(serviceID: string): Promise<BloodBankService | null> {
    try {
      const service = await prisma.bloodBankService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No BloodBankService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get BloodBankService.");
    }
  }

  async getByFacility(facilityID: string): Promise<BloodBankService | null> {
    try {
      const service = await prisma.bloodBankService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No BloodBankService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get BloodBankService.");
    }
  }  

  async create(facilityID: string, data: CreateBloodBankServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const bloodBankService = await tx.bloodBankService.create({
          data: { ...data, facility: { connect: { facilityID } } }
        });
  
        await bloodTypeMappingDAO.createBloodTypeMapping(bloodBankService.serviceID, tx);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create BloodBankService.");
    }
  }

  async getInformation(serviceID: string): Promise<BloodBankServiceDTO> {
    try {
      const service = await this.getByID(serviceID);
  
      if (!service) {
        throw new Error("Missing needed BloodBankService data.");
      }
  
      const bloodTypeAvailability = await bloodTypeMappingDAO.getBloodTypeMapping(serviceID);
  
      if (!bloodTypeAvailability) {
        throw new Error("Missing needed BloodTypeAvailability data.");
      }
  
      return {
        phoneNumber           : service.phoneNumber,
        openingTime           : service.openingTime,
        closingTime           : service.closingTime,
        pricePerUnit          : service.pricePerUnit,
        turnaroundTimeD       : service.turnaroundTimeD,
        turnaroundTimeH       : service.turnaroundTimeH,
        bloodTypeAvailability : bloodTypeAvailability,
        updatedAt             : service.updatedAt,
      };
  
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for BloodBankService.");
    }
  }

  async update(serviceID: string, data: BloodBankServiceDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.bloodBankService.update({
          where: { 
            serviceID 
          },
          data: {
            phoneNumber     : data.phoneNumber,
            openingTime     : data.openingTime,
            closingTime     : data.closingTime,
            pricePerUnit    : data.pricePerUnit,
            turnaroundTimeD : data.turnaroundTimeD,
            turnaroundTimeH : data.turnaroundTimeH,
          },
          select: {
            facilityID : true,
            updatedAt  : true,
          }
        });

        if (data.bloodTypeAvailability) {
          await bloodTypeMappingDAO.updateBloodTypeMapping(serviceID, data.bloodTypeAvailability, tx)
        }

        await prisma.facility.update({
          where: { 
            facilityID : service.facilityID 
          },
          data: { 
            updatedAt : service.updatedAt
          }
        });

      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update BloodBankService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.bloodBankService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete BloodBankService.");
    }
  }
}
