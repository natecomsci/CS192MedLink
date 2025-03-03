import { prisma } from "./prisma";

import type { AmbulanceService } from '@prisma/client';

import type { AmbulanceServiceDTO, 
              CreateAmbulanceServiceDTO 
            } from './DTOs';

// DAOs
export class AmbulanceServiceDAO {
  async getByID(serviceID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          serviceID 
        }
      });
  
      if (!service) {
        console.warn("No AmbulanceService found with the specified ID.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async getByFacility(facilityID: string): Promise<AmbulanceService | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: { 
          facilityID 
        }
      });
  
      if (!service) {
        console.warn("No AmbulanceService found in the facility.");
        return null;
      }
  
      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get AmbulanceService.");
    }
  }

  async create(facilityID: string, data: CreateAmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create AmbulanceService.");
    }
  }

  async getInformation(serviceID: string): Promise<AmbulanceServiceDTO> {
    try {
      const service = await this.getByID(serviceID);

      if (!service) {
        throw new Error("Missing needed AmbulanceService data.");
      }

      return {
        phoneNumber       : service.phoneNumber,
        openingTime       : service.openingTime,
        closingTime       : service.closingTime,
        baseRate          : service.baseRate,
        minCoverageRadius : service.minCoverageRadius,
        mileageRate       : service.mileageRate,
        maxCoverageRadius : service.maxCoverageRadius,
        availability      : service.availability,
        createdAt         : service.createdAt,
        updatedAt         : service.updatedAt,
      }

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for AmbulanceService.");
    }
  }

  async update(serviceID: string, data: AmbulanceServiceDTO): Promise<void> {
    try {
      await prisma.ambulanceService.update({
        where: { 
          serviceID 
        },
        data: {
          phoneNumber       : data.phoneNumber,
          openingTime       : data.openingTime,
          closingTime       : data.closingTime,
          baseRate          : data.baseRate,
          minCoverageRadius : data.minCoverageRadius,
          mileageRate       : data.mileageRate,
          maxCoverageRadius : data.maxCoverageRadius,
          availability      : data.availability,
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update AmbulanceService.");
    }
  }

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.ambulanceService.delete({
        where: { 
          serviceID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete AmbulanceService.");
    }
  }
}
