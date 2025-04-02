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
        throw new Error("No Facility found.");
      }

      console.log(`Facility ${facilityID}: `, facility);

      return facility;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Facility.");
    }
  }

  async update(facilityID: string, data: GeneralInformationFacilityDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { address, ...facilityData } = data;
    
        await tx.facility.update({
          where: { 
            facilityID 
          },
          data: {
            ...facilityData
          }
        });
  
        if (address) {
          await addressDAO.update(facilityID, address, tx);
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Facility.");
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
        throw new Error("Facility not found.");
      }

      const address = await addressDAO.getByFacility(facilityID);

      if (!address) {
        throw new Error("Address not found.");
      }

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
      throw new Error("Could not get information for Facility.");
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
        throw new Error("Facility not found.");
      }

      return facility.phoneNumber;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get phone number of Facility.");
    }
  }

  async facilityHasDivisions(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.division.count({
        where: {
          facilityID
        }
      });

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not check if Facility has Divisions.");
    }
  }

  async facilityHasServices(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.service.count({
        where: {
          facilityID
        }
      });

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not check if Facility has Services.");
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

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not check if Facility has Admins.");
    }
  }
}