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

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO(); // could inject this but whatever lol

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
        throw new Error(`No Division linked to ID ${divisionID} found.`);
      }

      console.log(`Fetched Division ${divisionID}: `);
  
      return division;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Fetched Divisions of Facility ${facilityID}: `);

      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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
  
        console.log(`Created Division ${division.divisionID}: `, division);

        return division.divisionID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Services successfully connected to Division ${divisionID}.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async update(divisionID: string, facilityID: string, employeeID: string, data: Create_UpdateDivisionDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const division = await tx.division.update({
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
  
        console.log(`Updated Division ${divisionID}: `, division);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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
          throw new Error(`No Division linked to ID ${divisionID} found.`);
        }

        await updateLogDAO.create(
          {
            entity : division.name,
            action : Action.DELETE,
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

      console.log(`Deletion of Division ${divisionID} successful.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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
        throw new Error(`No Division linked to ID ${divisionID} found.`);
      }

      console.log(`Fetched information of Division ${divisionID}: `);

      return {
        name        : division.name,
        phoneNumber : division.phoneNumber,
        openingTime : division.openingTime,
        closingTime : division.closingTime,

        ...(division.email ? { email: division.email } : {}),
      }
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getPhoneNumber(divisionID: string): Promise<string> {
    try {
      const division = await prisma.division.findUnique({
        where: { 
          divisionID 
        },
        select: {
          phoneNumber : true
        }
      });

      if (!division) {
        throw new Error(`No Division linked to ID ${divisionID} found.`);
      }

      console.log(`Fetched phone number of Division ${divisionID}: `);

      return division.phoneNumber;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async divisionHasServices(divisionID: string): Promise<boolean> {
    try {
      const count = await prisma.service.count({
        where: {
          divisionID
        }
      });

      console.log(`Does Division ${divisionID} have Services?`);

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getAllUniques(): Promise<{ emails: string[], phoneNumbers: string[] }> {
    try {
      const divisions = await prisma.division.findMany({
        select: {
          email       : true,
          phoneNumber : true,
        }
      });
  
      const emails = divisions.map((division) => division.email).filter((email): email is string => !!(email));
  
      const phoneNumbers = divisions.map((division) => division.phoneNumber);
  
      console.log("Fetched Division emails and phone numbers: ");
  
      return { emails, phoneNumbers };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getAllNamesByFacility(facilityID: string): Promise<string[]> {
    try {
      const divisions = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: {
          name: true
        }
      });
  
      console.log(`Fetched Division names of Facility ${facilityID}.`);
  
      return divisions.map((division) => division.name);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}

export class PatientDivisionListDAO {
  async getLoadMoreDivisionsByFacility(facilityID: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      console.log(`Fetched load more list of Facility ${facilityID}'s Divisions with offset ${offset}: `);

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
      throw new Error("No database connection.");
    }
  }

  async patientSearchDivisionsByFacility(facilityID: string, query: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      console.log(`Fetched load more list of Facility ${facilityID}'s Divisions with offset ${offset} whose name matches the search query "${query}": `);

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
      throw new Error("No database connection.");
    }
  }
}

export class FacilityDivisionListDAO {
  async getDivisionListPreview(facilityID: string, numberToFetch: number): Promise<string[]> {
    try {
      const divisions = await prisma.division.findMany({
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

      console.log(`Fetched Divisions preview of Facility ${facilityID}: `);

      return divisions.map((division) => division.name);
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async getPaginatedDivisionsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      console.log(`Page ${page} of the list of Facility ${facilityID}'s Divisions: `);

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
      throw new Error("No database connection.");
    }
  } 

  async employeeSearchDivisionsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of the list of Facility ${facilityID}'s Divisions whose name matches the search query "${query}": `);

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
      throw new Error("No database connection.");
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

      console.log(`Fetched list of Facility ${facilityID}'s Divisions with multiple services: `);

      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}