// @ts-nocheck

import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import type { Service } from '@prisma/client';

import { paginate, loadMore } from "./dataLayerUtility";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { ServiceDTO,
              LoadMoreResultsDTO,
              PaginatedResultsDTO 
            } from "./DTOs";

//

const serviceBaseSelect = {
  serviceID : true,
  type      : true,
  createdAt : true,
  updatedAt : true,
};

const serviceDivsSelect = {
  division: {
    select: {
      divisionID : true,
      name       : true,
    }
  }
};

function serviceSelect(includeDivs = false) {
  return includeDivs ? { ...serviceBaseSelect, ...serviceDivsSelect } : serviceBaseSelect;
}

const baseServiceSearchSelect = {
  serviceID : true,
  type      : true,
}

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO(); // could inject this but whatever lol

export class ServicesDAO {
  // generics

  async getByID(serviceID: string): Promise<Service> {
    try {
      const service = await prisma.service.findUnique({
        where: {
          serviceID
        }
      });

      if (!service) {
        throw new Error("No Service found with the specified ID.");
      }

      console.log(`Service ${serviceID}: `, service);

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
          facilityID
        },
        select: serviceSelect(true)
      });

      console.log(`Result of "services" query for Facility ${facilityID}: `, services);

      console.log(`Services of Facility ${facilityID}: `);

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Services of the Facility.");
    }
  }

  async getByDivision(divisionID: string): Promise<ServiceDTO[]> {
    try {
      const services = await prisma.service.findMany({
        where: {
          divisionID
        },
        select: serviceSelect()
      });

      console.log(`Result of "services" query for Division ${divisionID}: `, services);

      console.log(`Services of Division ${divisionID}: `);

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Services of the Division.");
    }
  }

  //

  async reconnectDivision(serviceID: string, divisionID: string): Promise<void> {
    try {
      const division = await prisma.service.update({
        where: { 
          serviceID 
        },
        data: {
          division: {
            connect: { 
              divisionID 
            }
          }
        },
        select: {
          divisionID: true
        }
      });

      console.log(`Updated Division of Service: `, division);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not connect Admin to Divisions.");
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
            type       : true,
            divisionID : true, 
          }
        });

        if (!service) {
          throw new Error("Service not found.");
        }
  
        await updateLogDAO.create(
          {
            entity: service.type,
            action: Action.DELETE,

            ...(service.divisionID && { divisionID: service.divisionID })
          },
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

  async getCreatableServices(facilityID: string): Promise<{ types: string[], outpatients: string[] }> {
    try {
      const services = (await this.getByFacility(facilityID)).map((service) => service.type);

      let types       = new Set<string>();
      let outpatients = new Set<string>();

      let hasOutpatient = false;

      for (const type of services) {
        if (["Ambulance", "Blood Bank", "Emergency Room", "Intensive Care Unit"].includes(type)) {
          types.add(type);
        }

        else {
          if (!hasOutpatient) {
            types.add("Outpatient");

            hasOutpatient = true;
          }

          outpatients.add(type);
        }
      }

      return {
        types       : Array.from(types),
        outpatients : Array.from(outpatients),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get creatable Services.");
    }
  }
}

export class PatientServiceListDAO {
  async patientSearch(query: string, filters: any, numberToFetch: number, offset: number): Promise<LoadMoreResultsDTO> { // to refine for location-based search
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      return await loadMore({
        model: prisma.service,
        where: {
          ...filters,
          type: { 
            contains : query, mode : "insensitive"
          }
        },
        select: {
          ...baseServiceSearchSelect,
          facility  : {
            select: {
              facilityID : true,
              name       : true,
            }
          },
        },
        orderBy: { 
          updatedAt: "desc" 
        },
        offset,
        numberToFetch,
        mapping: ({ serviceID, type, facility: { facilityID, name } }: any) => ({
          serviceID,
          type,
          facilityID,
          name,
        })        
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for Facilities with Services that match the search query.");
    }
  }

  async getLoadMoreServicesByFacility(facilityID: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      return await loadMore({
        model: prisma.service,
        where: { 
          facilityID
        },
        select: baseServiceSearchSelect,
        orderBy,
        offset,
        numberToFetch
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get load more Services within the entire Facility.");
    }
  }

  async patientSearchServicesByFacility(facilityID: string, query: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      return await loadMore({
        model: prisma.service,
        where: { 
          facilityID,
          type: { 
            contains: query, mode: "insensitive" 
          } 
        },
        select: baseServiceSearchSelect,
        orderBy,
        offset,
        numberToFetch
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Services within the entire Facility that match the search query.");
    }
  }
}

export class FacilityServiceListDAO {
  async getServiceListPreview(facilityID: string, numberToFetch: number): Promise<string[]> {
    try {
      const services = await prisma.service.findMany({
        where: {
          facilityID
        },
        select: {
          type: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: numberToFetch
      })

      return services.map((service) => service.type);
    } catch (error) {
      console.error("Details:", error);
      throw new Error("Could not get Services preview.");
    }
  } 

  async getPaginatedServicesByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      return await paginate({
        model: prisma.service,
        where: {
          facilityID
        },
        select: serviceSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("Could not get paginated Services within the entire Facility.");
    }
  } 

  async employeeSearchServicesByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      return await paginate({
        model: prisma.service,
        where: {
          facilityID,
          type: { 
            contains: query, mode: "insensitive" 
          }
        },
        select: serviceSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated Services within the entire Facility that match the search query.");
    }
  }

  async getPaginatedServicesByDivision(divisionID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      return await paginate({
        model: prisma.service,
        where: {
          divisionID
        },
        select: serviceSelect(),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("Could not get paginated Services within the Division.");
    }
  }

  async employeeSearchServicesByDivision(divisionID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      return await paginate({
        model: prisma.service,
        where: {
          divisionID,
          type: { 
            contains: query, mode: "insensitive" 
          }
        },
        select: serviceSelect(),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated Services within the Division that match the search query.");
    }
  }
}