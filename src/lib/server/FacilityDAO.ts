// @ts-nocheck

import { prisma } from "./prisma";

import { Prisma } from "@prisma/client";

import { Role } from "@prisma/client";

import type { Facility } from "@prisma/client";

import type { GeneralInformationFacilityDTO } from "./DTOs";

import { AddressDAO } from "./AddressDAO";

const addressDAO: AddressDAO = new AddressDAO();

export class FacilityDAO {
  async getByID(facilityID: string): Promise<Facility> {
    try {
      const facility = await prisma.facility.findUnique({
        where: {
          facilityID
        }
      });

      if (!facility) {
        throw new Error(`No Facility linked to ID ${facilityID} found.`);
      }

      console.log(`Fetched Facility ${facilityID}: `);

      return facility;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async update(facilityID: string, data: GeneralInformationFacilityDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { address, ...facilityData } = data;
    
        const facility = await tx.facility.update({
          where: { 
            facilityID 
          },
          data: {
            ...facilityData
          },
          include: {
            address: true
          }
        });
  
        if (address) {
          await addressDAO.update(facilityID, address, tx);
        }

        console.log(`Updated Facility ${facilityID}: `, facility);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  /*
  async updatePhoto(facilityID: string, <INSERT PARAMETERS>): Promise<void> {
    try {
      
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Employee photo.");
    }
  }
  */

  async getInformation(facilityID: string): Promise<GeneralInformationFacilityDTO> {
    try {
      const facility = await prisma.facility.findUnique({
        where: { 
          facilityID 
        },
        select: {
          name              : true,
          photo             : true,
          email             : true,
          phoneNumber       : true,
          openingTime       : true,
          closingTime       : true,
          facilityType      : true,
          ownership         : true,
          bookingSystem     : true,
          acceptedProviders : true,
        }
      });  

      if (!facility) {
        throw new Error(`No Facility linked to ID ${facilityID} found.`);
      }

      const address = await addressDAO.getByFacility(facilityID);

      if (!address) {
        throw new Error(`No Address linked to Facility ${facilityID} found.`);
      }

      console.log(`Fetched information of Facility ${facilityID}: `);

      return {
        name              : facility.name,
        photo             : facility.photo,
        address           : address,
        phoneNumber       : facility.phoneNumber,
        facilityType      : facility.facilityType,
        ownership         : facility.ownership,
        acceptedProviders : facility.acceptedProviders,

        ...(facility.email ? { email: facility.email } : {}),

        ...(facility.openingTime ? { openingTime: facility.openingTime } : {}),

        ...(facility.closingTime ? { closingTime: facility.closingTime } : {}),

        ...(facility.bookingSystem
          ? { bookingSystem: facility.bookingSystem }
          : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getPhoneNumber(facilityID: string): Promise<string> {
    try {
      const facility = await prisma.facility.findUnique({
        where: { 
          facilityID 
        },
        select: {
          phoneNumber : true
        }
      });  

      if (!facility) {
        throw new Error(`No Facility linked to ID ${facilityID} found.`);
      }

      console.log(`Fetched phone number of Facility ${facilityID}: `);

      return facility.phoneNumber;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async facilityHasDivisions(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.division.count({
        where: {
          facilityID
        }
      });

      console.log(`Does Facility ${facilityID} have Divisions?`);

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async facilityHasServices(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.service.count({
        where: {
          facilityID
        }
      });

      console.log(`Does Facility ${facilityID} have Services?`);

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async facilityHasAdmins(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.employee.count({
        where: {
          facilityID,
          role: Role.ADMIN
        }
      });

      console.log(`Does Facility ${facilityID} have Admins?`);

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getAllUniques(): Promise<{ emails: string[], phoneNumbers: string[] }> {
    try {
      const facilities = await prisma.facility.findMany({
        select: {
          email       : true,
          phoneNumber : true,
        }
      });
  
      const emails = facilities.map((facility) => facility.email).filter((email): email is string => !!(email));
  
      const phoneNumbers = facilities.map((facility) => facility.phoneNumber);
  
      console.log("Fetched Facility emails and phone numbers: ");
  
      return { emails, phoneNumbers };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}