import { prisma } from "./prisma";

import type { ServiceDTO } from "./DTOs";

import type { Service } from '@prisma/client';
// Because of the heterogenous nature of the services, pagination must be done in the business logic instead of natively on Prisma.

export class ServicesDAO {
  async getByID(serviceID: string): Promise<Service | null> {
    try {
      const service = await prisma.ambulanceService.findUnique({
        where: {
          serviceID
        }
      });

      if (!service) {
        console.warn("No Service found with the specified ID.");
        return null;
      }

      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Service.");
    }
  }

  async getByFacility(facilityID: string): Promise<ServiceDTO[]> {
    try {
      const services = await prisma.service.findMany({
        where: {
          facilityID,
        },
        select: {
          serviceID: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get services of the facility.");
    }
  }

  /*
  async getCreatableServicesByFacility(facilityID: string): 
  Promise<{ creatableServiceTypes: string[], creatableOutpatientServices: ServiceType[]}> {
    try {
      const services = await this.getServicesByFacility(facilityID);

      let creatableServiceTypes:       string[]      = []; // removed "None" kasi cop-out solution lang sya ryt,,,
      let creatableOutpatientServices: ServiceType[] = []; // removed "None" kasi cop-out solution lang sya ryt,,,

      for (const [key, value] of Object.entries(services)) {
        if ((value === null) && (key in this.serviceMapping)) {
          creatableServiceTypes.push(this.serviceMapping[key]);
        }
      }

      let existingOutpatientServiceTypes: ServiceType[] = services.outpatientServices.map(service => service.serviceType);

      for (let serviceType of OutpatientServiceTypes) {              // serviceTypes to be imported
        if (!existingOutpatientServiceTypes.includes(serviceType)) {
          creatableOutpatientServices.push(serviceType);
        }
      }

      if (creatableOutpatientServices.length > 0) {
        creatableServiceTypes.push("Outpatient");
      }

      return { creatableServiceTypes, creatableOutpatientServices };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get creatable services.");
    }
  }

  async getCreatableServicesByFacility(facilityID: string): Promise<string[]> {
    try {
      const services = await this.getServicesByFacility(facilityID);

      let creatableServiceTypes: string[] = [];

      for (const [key, value] of Object.entries(services)) {
        if ((value === null) && (key in this.serviceMapping)) {
          creatableServiceTypes.push(this.serviceMapping[key]);
        }
      }

      let existingOutpatientServiceTypes: ServiceType[] = services.outpatientServices.map(service => service.serviceType);

      for (let serviceType of OutpatientServiceTypes) {              // serviceTypes to be imported
        if (!existingOutpatientServiceTypes.includes(serviceType)) {
          creatableServiceTypes.push(serviceType);
        }
      }

      return creatableServiceTypes;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get creatable services.");
    }
  }
  */

  async search(query: string, offset: number): Promise<ServiceDTO[]> { // loads 10 search results from an input offset
    try {
      const services = await prisma.service.findMany({
        where: {
          OR: [
            { 
              type: { 
                search : query 
              } 
            },
            { 
              keywords: { 
                has: query 
              } 
            }
          ]
        },
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          serviceID : true,
          type      : true,
          createdAt : true,
          updatedAt : true,
        },
        skip: offset,
        take: 10
      });

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for services.");
    }
  }

  // to do: getpaginatedservices

  async delete(serviceID: string): Promise<void> {
    try {
      await prisma.service.delete({
        where: {
          serviceID
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Service.");
    }
  }
}
