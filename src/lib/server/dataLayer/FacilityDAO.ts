import { prisma } from "./prisma";

import { Prisma } from "@prisma/client";

import { ContactType, Role } from "@prisma/client";

import type { Facility } from "@prisma/client";

import type { GeneralInformationFacilityDTO, UpdateGeneralInformationFacilityDTO } from "./DTOs";

import { AddressDAO } from "./AddressDAO";

import { ContactDAO } from "./ContactDAO";

const contactDAO: ContactDAO = new ContactDAO();

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

  async update(facilityID: string, data: UpdateGeneralInformationFacilityDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { address, email, phoneNumber, ...facilityData } = data;
    
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

        // email = [] means delete everything

        if (email) {
          await contactDAO.deleteMany("facility", facilityID, tx);
  
          if (email.length > 0) {
            await contactDAO.createMany(
              "facility",
              facilityID,
              email.map((info) => ({
                info,
                type: ContactType.EMAIL
              })),
              tx
            );
          }
        }

        // phoneNumber = [] means delete everything

        if (phoneNumber) {
          await contactDAO.deleteMany("facility", facilityID, tx);
  
          if (phoneNumber.length > 0) {
            await contactDAO.createMany(
              "facility",
              facilityID,
              phoneNumber.map((info) => ({
                info,
                type: ContactType.PHONE
              })),
              tx
            );
          }
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

      const email = await contactDAO.getPhoneNumbersByFacility(facilityID);

      const phoneNumber = await contactDAO.getEmailsByFacility(facilityID);

      console.log(`Fetched information of Facility ${facilityID}: `);

      return {
        name              : facility.name,
        photo             : facility.photo,
        address           : address,
        facilityType      : facility.facilityType,
        ownership         : facility.ownership,
        acceptedProviders : facility.acceptedProviders,
        phoneNumber,

        ...(facility.openingTime ? { openingTime: facility.openingTime } : {}),

        ...(facility.closingTime ? { closingTime: facility.closingTime } : {}),

        ...(email.length ? { email } : {}),

        ...(facility.bookingSystem
          ? { bookingSystem: facility.bookingSystem }
          : {})
      };
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
}