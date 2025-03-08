import { prisma } from "./prisma";

import { Prisma } from "@prisma/client";

import { Provider } from "@prisma/client";

import type { Facility } from "@prisma/client";

import type { AddressDTO, FacilityDTO, GeneralInformationFacilityDTO } from "./DTOs";

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

      if (!facility.email || !facility.phoneNumber || !facility.facilityType || !facility.ownership) {
        throw new Error("Facility information is incomplete.");
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
        await tx.facility.update({
          where: { 
            facilityID 
          },
          data: {
            name              : data.name,
            photo             : data.photo,
            email             : data.email,
            phoneNumber       : data.phoneNumber,
            facilityType      : data.facilityType,
            ownership         : data.ownership,
            bookingSystem     : data.bookingSystem,
            acceptedProviders : data.acceptedProviders,
          }
        });

        if (data.address) {
          await addressDAO.updateAddress(facilityID, data.address, tx)
        }
      });
    } catch (error) {
      console.log("Details: ", error)
      throw new Error("Could not update general information for Facility.");
    }
  }

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

  async facilityHasAdmins(facilityID: string): Promise<boolean> {
    try {
      const count = await prisma.admin.count({
        where: {
          facilityID
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

  async search(query: string, offset: number): Promise<FacilityDTO[]> { // loads 10 search results from an input offset
    try {
      const facilities = await prisma.facilities.findMany({
        where: {
          type: {
            search: query
          }
        },
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          facilityID : true,
          name       : true,
        },
        skip: offset,
        take: 10
      });

      return facilities;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for facilities.");
    }
  }

  async getAllFacilities(): Promise<FacilityDTO[]> {
    try {
      const facilities = await prisma.facility.findMany({
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          facilityID: true,
          name: true,
        }
      });
  
      return facilities;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not retrieve facilities.");
    }
  }
}
