// @ts-nocheck

import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Action }  from "@prisma/client";

import type { Division } from '@prisma/client';

import { paginate, loadMore } from "./dataLayerUtility";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { DivisionDTO,
              Create_UpdateDivisionDTO,
              MultiServiceDivisionsDTO,
              FacilityDivisionResultsDTO,
              LoadMoreResultsDTO,
              PaginatedResultsDTO
            } from "./DTOs";

const divisionBaseSelect = {
  divisionID : true,
  name       : true,
}

const divisionCrUpSelect = {
  createdAt  : true,
  updatedAt  : true,
};

function divisionSelect(includeCrUp = false) {
  return includeCrUp ? { ...divisionBaseSelect, ...divisionCrUpSelect } : divisionBaseSelect;
}

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO(); // could inject this but whatever lol

export class DivisionDAO {
  // generics

  async getByID(divisionID: string): Promise<Division> {
    try {
      const division = await prisma.division.findUnique({
        where: {
          divisionID
        }
      });

      if (!division) {
        throw new Error("No Division found with the specified ID.");
      }

      console.log(`Division ${divisionID}: `, division);
  
      return division;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Division.");
    }
  }

  async getByFacility(facilityID: string): Promise<DivisionDTO[]> {
    try {
      const divisions = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: divisionSelect(true)
      });

      console.log(`Result of "divisions" query for Facility ${facilityID}: `, divisions);

      console.log(`Divisions of Facility ${facilityID}: `);

      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Divisions of the Facility.");
    }
  }

  //

  async create(facilityID: string, employeeID: string, data: Create_UpdateDivisionDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx) => {
        const division = await tx.division.create({
          data: {
            ...data,
            facility: {
              connect: { 
                facilityID 
              }
            }
          }
        });
  
        await updateLogDAO.create(
          {
            entity     : data.name,
            action     : Action.CREATE,
            divisionID : division.divisionID
          },
          facilityID,
          employeeID,
          tx
        );
  
        console.log(`Created Division: `, division);

        return division.divisionID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create Division.");
    }
  }  

  async connectServices(divisionID: string, serviceIDs: string[]): Promise<void> {
    try {
      await prisma.service.updateMany({
        where: {
          serviceID: { 
            in: serviceIDs
          }
        },
        data: {
          divisionID
        }
      });      
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not connect Services to Division.");
    }
  }

  async update(divisionID: string, facilityID: string, employeeID: string, data: Create_UpdateDivisionDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const division = await prisma.division.update({
          where: { 
            divisionID 
          },
          data
        });
  
        await updateLogDAO.create(
          {
            entity     : division.name,
            action     : Action.UPDATE,
            divisionID : division.divisionID
          },
          facilityID,
          employeeID,
          tx
        );
  
        console.log(`Updated Division: `, division);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Division.");
    }
  }

  async delete(divisionID: string, facilityID: string, employeeID: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const division = await tx.division.findUnique({
          where: { 
            divisionID 
          },
          select: { 
            name       : true, 
            divisionID : true,
          }
        });
  
        if (!division) {
          throw new Error("Division not found.");
        }

        await updateLogDAO.create(
          {
            entity     : division.name,
            action     : Action.DELETE,
          },
          facilityID,
          employeeID,
          tx
        );
  
        await tx.division.delete({
          where: { 
            divisionID 
          }
        });
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Division.");
    }
  }  

  async getInformation(divisionID: string): Promise<Create_UpdateDivisionDTO> {
    try {
      const division = await prisma.division.findUnique({
        where: { 
          divisionID 
        },
        select: {
          name        : true,
          email       : true,
          phoneNumber : true,
          openingTime : true,
          closingTime : true,
        }
      });    

      if (!division) {
        throw new Error("Division not found.");
      }

      return {
        name        : division.name,
        phoneNumber : division.phoneNumber,
        openingTime : division.openingTime,
        closingTime : division.closingTime,

        ...(division.email ? { email: division.email } : {}),
      }
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for Division.");
    }
  }

  async divisionHasServices(divisionID: string): Promise<boolean> {
    try {
      const count = await prisma.service.count({
        where: {
          divisionID
        }
      });

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not check if Division has Services.");
    }
  }

  async getMultiServiceDivisions(facilityID: string): Promise<MultiServiceDivisionsDTO[]> {
    try {
      const multiServiceDivisionIDs = await prisma.service.groupBy({
        by: ["divisionID"],
        where: {
          division: {
            facilityID
          }
        },
        having: {
          divisionID: {
            _count: {
              gt: 1
            }
          }
        }
      });
  
      const divisionIDs = multiServiceDivisionIDs.map(division => division.divisionID).filter((divisionID): divisionID is string => (divisionID !== null));
  
      if (divisionIDs.length === 0) {
        return [];
      }
  
      const divisions = await prisma.division.findMany({
        where: {
          divisionID: { 
            in: divisionIDs 
          }
        },
        select: {
          ...divisionSelect(),
          services: {
            select: {
              serviceID : true,
              type      : true,
            }
          }
        }
      });
  
      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Divisions with multiple Services.");
    }
  }
}

export class PatientDivisionListDAO {
  async getLoadMoreDivisionsByFacility(facilityID: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      return await loadMore({
        model: prisma.division,
        where: { 
          facilityID
        },
        select: divisionSelect(),
        orderBy,
        offset,
        numberToFetch
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get load more Divisions within the entire Facility.");
    }
  }

  async patientSearchDivisionsByFacility(facilityID: string, query: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      return await loadMore({
        model: prisma.division,
        where: { 
          facilityID,
          name: { 
            contains: query, mode: "insensitive" 
          } 
        },
        select: divisionSelect(),
        orderBy,
        offset,
        numberToFetch
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Divisions within the entire Facility that match the search query.");
    }
  }
}

export class FacilityDivisionListDAO {
  async getDivisionListPreview(facilityID: string, numberToFetch: number): Promise<string[]> {
    try {
      const services = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: {
          name: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: numberToFetch
      })

      return services.map((division) => division.name);
    } catch (error) {
      console.error("Details:", error);
      throw new Error("Could not get Divisions preview.");
    }
  } 

  async getPaginatedDivisionsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      return await paginate({
        model: prisma.division,
        where: {
          facilityID
        },
        select: divisionSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("Could not get paginated Divisions within the entire Facility.");
    }
  } 

  async employeeSearchDivisionsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      return await paginate({
        model: prisma.division,
        where: {
          facilityID,
          name: { 
            contains: query, mode: "insensitive" 
          }
        },
        select: divisionSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated Divisions within the entire Facility that match the search query.");
    }
  }
}