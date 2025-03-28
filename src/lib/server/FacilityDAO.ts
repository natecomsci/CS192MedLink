// @ts-nocheck comment at the top of a file

import { prisma } from "./prisma";

import { Prisma } from "@prisma/client";

import { Role, Provider } from "@prisma/client";

import type { Facility } from "@prisma/client";

import type { AddressDTO, 
              FacilityResultsDTO, 
              GeneralInformationFacilityDTO 
            } from "./DTOs";

import { AddressDAO } from "./AddressDAO";

const addressDAO: AddressDAO = new AddressDAO();

export class FacilityDAO {
  async getByID(facilityID: string): Promise<Facility | null> {
    try {
      const facility = await prisma.facility.findUnique({
        where: {
          facilityID
        }
      });

      if (!facility) {
        console.warn("No Facility found.");
        return null;
      }

      return facility;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Facility.");
    }
  }

  async getGeneralInformation(facilityID: string): Promise<GeneralInformationFacilityDTO> {
    try {
      const facility = await this.getByID(facilityID);

      if (!facility) {
        throw new Error("Missing needed Facility data.");
      }

      const address = await this.getAddressByFacility(facilityID);

      if (!address) {
        throw new Error("Missing needed Address data.");
      }

      return {
        name              : facility.name,
        photo             : facility.photo,
        address           : address,
        email             : facility.email,
        phoneNumber       : facility.phoneNumber,
        facilityType      : facility.facilityType,
        ownership         : facility.ownership,
        acceptedProviders : facility.acceptedProviders,

        ...(facility.bookingSystem ? { bookingSystem: facility.bookingSystem } : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get general information for Facility.");
    }
  }

  async updateGeneralInformation(facilityID: string, data: GeneralInformationFacilityDTO): Promise<void> {
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
          await addressDAO.updateAddress(facilityID, address, tx);
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update general information for Facility.");
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

  async getAddressByFacility(facilityID: string): Promise<AddressDTO | null> {
    try {
      const address = await prisma.address.findUnique({
        where: { 
          facilityID 
        },
        select: {
          regionID : true,
          pOrCID   : true,
          cOrMID   : true,
          brgyID   : true,
          street   : true,
        }
      });
  
      if (!address) {
        console.warn("No Address found.");
        return null;
      }

      return address;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Address.");
    }
  }

  async getInsurancesByFacility(facilityID: string): Promise<Provider[]> {
    try {
      const facility = await this.getByID(facilityID);

      if (!facility) {
        throw new Error("Missing needed Facility data.");
      }

      return facility.acceptedProviders;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get accepted providers.");
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
  
  async getFacilityByServiceID(serviceID: string) { // no return type
    try {
      return await prisma.facility.findFirst({
        where: {
          services: { 
            some: { 
              serviceID 
            } 
          }
        },
        select: {
          facilityID : true,
          name       : true,
          address    : true,
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Facility by serviceID.");
    }
  }

  async patientSearch(query: string, numberToFetch: number, offset: number): Promise<{ results: FacilityResultsDTO[], hasMore: boolean }> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }
  
      const facilities = await prisma.facility.findMany({
        where: { 
          name: { 
            contains : query, mode : "insensitive"
          } 
        },
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          facilityID : true,
          name       : true,
          address    : {
            select: {
              regionID : true,
              pOrCID   : true,
              cOrMID   : true,
              brgyID   : true,
              street   : true,
            }
          }
        },
        skip: offset,
        take: numberToFetch + 1
      });
  
      return {
        results: facilities.slice(0, numberToFetch),
        hasMore: facilities.length > numberToFetch,
      };
    } catch (error) {
      console.error("Search Error: ", error);
      throw new Error("Could not search Facilities.");
    }
  }
}