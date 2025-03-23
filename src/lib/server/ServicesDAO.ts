// @ts-nocheck comment at the top of a file

import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ServiceDTO, 
              PaginatedServiceDTO 
            } from "./DTOs";

import type { ServiceResultsDTO } from "./DTOs";

import type { Service } from '@prisma/client';

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export class ServicesDAO {
  async getByID(serviceID: string): Promise<Service | null> {
    try {
      const service = await prisma.service.findUnique({
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

  // unsure of output format. are these all needed or kahit ID lang. (ifl ID lang)

  async getByFacility(facilityID: string): Promise<ServiceDTO[]> {
    try {
      const services = await prisma.service.findMany({
        where: {
          facilityID
        },
        select: {
          serviceID : true,
          type      : true,
          createdAt : true,
          updatedAt : true,
        }
      });

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Services of the facility.");
    }
  }

  async delete(serviceID: string, facilityID: string, employeeID: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const service = await tx.service.findUnique({
          where: { 
            serviceID 
          },
          select: { 
            type: true 
          }
        });

        if (!service) {
          throw new Error("Service not found.");
        }
  
        await updateLogDAO.createUpdateLog(
          { entity: service.type, action: Action.DELETE },
          facilityID,
          employeeID,
          tx
        );
  
        await prisma.service.delete({
          where: {
            serviceID
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Service.");
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

  async patientSearch(query: string, numberToFetch: number, offset: number): Promise<{ results: ServiceResultsDTO[], hasMore: boolean }> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      const services = await prisma.service.findMany({
        where: { 
          type: { 
            contains : query, mode : "insensitive"
          } 
        },
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          serviceID : true,
          type      : true,
          facility  : {
            select: {
              facilityID : true,
              name       : true,
            }
          },
        },
        skip: offset,
        take: numberToFetch + 1
      });

      const results = services.map(({ serviceID, type, facility }) => ({facilityID: facility.facilityID, name: facility.name, serviceID, type}));

      return {
        results: results.slice(0, numberToFetch),
        hasMore: services.length > numberToFetch,
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for Facilities with Services whose name matches the query.");
    }
  }

  async patientSearchByFacility(query: string, numberToFetch: number, offset: number, facilityID: string): Promise<{ results: ServiceDTO[], hasMore: boolean }> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      const services = await prisma.service.findMany({
        where: {
          facilityID,
          type: { 
            contains : query, mode : "insensitive"
          } 
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
        take: numberToFetch + 1,
        skip: offset
      });

      return {
        results: services.slice(0, numberToFetch),
        hasMore: services.length > numberToFetch,
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for Services within the facility whose name matches the query.");
    }
  }

  async getPaginatedServicesByFacility(facilityID: string, page: number, pageSize: number): Promise<PaginatedServiceDTO> {
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
            updatedAt : true,
          },
          orderBy: {
            updatedAt: "desc"
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.service.count({ 
          where: { 
            facilityID 
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalServices / pageSize)); // only needed for admins, etc.

      return { services, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated Services within the entire facility.");
    }
  }

  async employeeSearchServicesByFacility(facilityID: string, query: string, page: number, pageSize: number): Promise<PaginatedServiceDTO> {
    try {
      if (!(query.trim())) {
        return { services: [], totalPages: 1, currentPage: page };
      }

      const [services, totalServices] = await Promise.all([
        prisma.service.findMany({
          where: {
            facilityID,
            type: { 
              contains: query, mode: "insensitive" 
            }
          },
          select: {
            serviceID : true,
            type      : true,
            createdAt : true,
            updatedAt : true,
          },
          orderBy: {
            updatedAt: "desc"
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.service.count({ 
          where: { 
            facilityID,
            type: { 
              contains: query, mode: "insensitive" 
            }
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalServices / pageSize)); // only needed for admins, etc.

      return { services, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search paginated Services within the entire facility.");
    }
  }
}
