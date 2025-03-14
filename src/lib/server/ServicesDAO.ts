import { prisma } from "./prisma";

import type { PaginatedServiceDTO, ServiceDTO } from "./DTOs";
import type { FacilityDTO } from "./DTOs";
import type { Service } from '@prisma/client';

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

  async search(query: string, offset: number): Promise<{ results: FacilityDTO[], hasMore: boolean }> {
    try {
      const facilities = await prisma.facility.findMany({
        where: { services: { some: { type: { contains: query, mode: "insensitive" } } } },
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          facilityID : true,
          name       : true,
        },
        skip: offset,
        take: 11
      });
  
      return {
        results: facilities.slice(0, 10),
        hasMore: facilities.length > 10,
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for facilities.");
    }
  }
  
  async getPaginatedServices(facilityID: string, page: number, pageSize: number): Promise<{ services: ServiceDTO[]; totalPages: number; currentPage: number }> {
    try {
      const [services, totalServices] = await Promise.all([
        prisma.service.findMany({
          where: {
            facilityID
          },
          select: {
            serviceID : true,
            type      : true,
            createdAt : true,
            updatedAt : true
          },
          skip: (page - 1) * pageSize,
          take: pageSize
        }),
        prisma.service.count({ 
          where: { 
            facilityID 
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalServices / pageSize));

      return { services, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated services.");
    }
  }

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
