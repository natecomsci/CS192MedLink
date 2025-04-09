// @ts-nocheck

import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Role, Action }  from "@prisma/client";

import type { Service } from '@prisma/client';

import { paginate, loadMore } from "./dataLayerUtility";

import { getEmployeeScopedWhereClause } from "./EmployeeDAO";

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

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO(); // could inject this but whatever lol

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
        throw new Error(`No Service linked to ID ${serviceID} found.`);
      }

      console.log(`Fetched Service ${serviceID}: `);

      return service;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Fetched Services of Facility ${facilityID}: `);

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Fetched Services of Division ${divisionID}: `);

      return services;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Updated Division of Service ${serviceID}: `, division);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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
          throw new Error(`No Service linked to ID ${serviceID} found.`);
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

        console.log(`Deletion of Service ${serviceID} successful.`);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getFacility(serviceID: string): Promise<{ facilityID: string, name: string }> {
    try {
      const service = await prisma.service.findUnique({
        where: {
          serviceID
        },
        select: {
          facility: {
            select: {
              facilityID : true,
              name       : true,
            }
          }
        }
      });

      if (!service) {
        throw new Error(`No Service linked to ID ${serviceID} found.`);
      }

      console.log(`Fetched Facility of Service ${serviceID}: `);

      return service.facility;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getDivision(serviceID: string): Promise<{ divisionID: string, name: string }> {
    try {
      const service = await prisma.service.findUnique({
        where: {
          serviceID
        },
        select: {
          division: {
            select: {
              divisionID : true,
              name       : true,
            }
          }
        }
      });

      if (!service) {
        throw new Error(`No Service linked to ID ${serviceID} found.`);
      }

      if (!service.division) {
        throw new Error(`No Division linked to Service ${serviceID} found.`);
      }

      const { divisionID, name } = service.division;

      if (!divisionID || !name) {
        throw new Error("Incomplete Division details.");
      }

      console.log(`Fetched Division of Service ${serviceID}: `);

      return { divisionID, name };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Fetched creatable Service types of Facility ${facilityID}: `);

      return {
        types       : Array.from(types),
        outpatients : Array.from(outpatients),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}

export class PatientServiceListDAO {
  async patientSearch(query: string, filters: any, numberToFetch: number, offset: number): Promise<LoadMoreResultsDTO> { // to refine for location-based search
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      console.log(`Fetched load more list of Services with offset ${offset} whose name matches the search query "${query}": `);
  
      const facilityFilter = {
        ...(filters.ownership && filters.ownership !== "any"
          ? { 
              ownership: filters.ownership 
            }
          : {}),
        ...(filters.facilityType && filters.facilityType !== "any"
          ? { 
              facilityType: filters.facilityType 
            }
          : {}),
        ...(filters.acceptedProviders && filters.acceptedProviders.length > 0
          ? {
              acceptedProviders: { 
                hasSome: filters.acceptedProviders 
              }
            }
          : {})
      };
  
      const where: any = {
        type: {
          contains: query, mode: "insensitive"
        },
        facility: facilityFilter
      };

      return await loadMore({
        model: prisma.service,
        where,
        select: {
          ...baseServiceSearchSelect,
          facility: {
            select: {
              facilityID : true,
              name       : true,
            }
          }
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
          name
        })        
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getLoadMoreServicesByFacility(facilityID: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      console.log(`Fetched load more list of Facility ${facilityID}'s Services with offset ${offset}: `);

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
      throw new Error("No database connection.");
    }
  }

  async patientSearchServicesByFacility(facilityID: string, query: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      console.log(`Fetched load more list of Facility ${facilityID}'s Services with offset ${offset} whose name matches the search query "${query}": `);

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
      throw new Error("No database connection.");
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

      console.log(`Fetched Services preview of Facility ${facilityID}: `);

      return services.map((service) => service.type);
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async getPaginatedServicesByFacility(facilityID: string, employeeID: string, role: Role, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      console.log(`Page ${page} of the list of Facility ${facilityID}'s Services: `);

      const where = await getEmployeeScopedWhereClause(facilityID, employeeID, role);

      return await paginate({
        model: prisma.service,
        where,
        select: serviceSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async employeeSearchServicesByFacility(facilityID: string, employeeID: string, role: Role, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      const where = await getEmployeeScopedWhereClause(facilityID, employeeID, role, query, "type");

      console.log(`Page ${page} of the list of Facility ${facilityID}'s Services whose name matches the search query "${query}": `);

      return await paginate({
        model: prisma.service,
        where,
        select: serviceSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getPaginatedServicesByDivision(divisionID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      console.log(`Page ${page} of the list of Division ${divisionID}'s Services: `);

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
      throw new Error("No database connection.");
    }
  }

  async employeeSearchServicesByDivision(divisionID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of the list of Division ${divisionID}'s Services whose name matches the search query "${query}": `);

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
      throw new Error("No database connection.");
    }
  }
}