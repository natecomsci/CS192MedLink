import { prisma } from "./prisma";

import { Prisma } from "@prisma/client";

import { paginate } from "./dataLayerUtility";

import type { CreateUpdateLogDTO, 
              PaginatedResultsDTO 
            } from "./DTOs";

const updateLogSelect = {
  entity     : true,
  action     : true,
  employee: {
    select: {
      employeeID : true,
      fname      : true,
      mname      : true,
      lname      : true,
    }
  },
  createdAt  : true,
}

export class UpdateLogDAO {
  async create(data: CreateUpdateLogDTO, facilityID: string, employeeID: string, tx: Prisma.TransactionClient): Promise<void> {
    try {
      const { divisionID, ...rest } = data;

      const updateLog = await tx.updateLog.create({
        data: {
          ...rest,
          facility : {
            connect: {
              facilityID
            },
          },
          employee : {
            connect: {
              employeeID
            }
          },
          ...(divisionID && {
            division: {
              connect: {
                divisionID
              }
            }
          })
        }
      });

      console.log(`Created Update Log ${updateLog.updateLogID}: `, updateLog);
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  }  

  async getPaginatedUpdateLogsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      console.log(`Page ${page} of the list of Facility ${facilityID}'s Update Logs: `);

      return await paginate({
        model: prisma.updateLog,
        where: {
          facilityID
        },
        select: updateLogSelect,
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async employeeSearchUpdateLogsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of the list of Facility ${facilityID}'s Update Logs whose name matches the search query "${query}": `);

      return await paginate({
        model: prisma.updateLog,
        where: {
          facilityID,
          entity: { 
            contains: query, mode: "insensitive" 
          }
        },
        select: updateLogSelect,
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getPaginatedUpdateLogsByDivision(divisionID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      console.log(`Page ${page} of the list of Division ${divisionID}'s Update Logs: `);

      return await paginate({
        model: prisma.updateLog,
        where: {
          divisionID
        },
        select: updateLogSelect,
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async employeeSearchUpdateLogsByDivision(divisionID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of the list of Division ${divisionID}'s Update Logs whose name matches the search query "${query}": `);

      return await paginate({
        model: prisma.updateLog,
        where: {
          divisionID,
          entity: { 
            contains: query, mode: "insensitive" 
          }
        },
        select: updateLogSelect,
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