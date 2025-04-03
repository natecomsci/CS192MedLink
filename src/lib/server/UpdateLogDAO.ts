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

    console.log(`Created Update Log: `, updateLog);
  }

  async getPaginatedUpdateLogsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
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
      throw new Error("Could not get paginated Update Logs within the entire Facility.");
    }
  } 

  async employeeSearchUpdateLogsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      return await paginate({
        model: prisma.updateLog,
        where: {
          facilityID,
          type: { 
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
      throw new Error("Could not get paginated Update Logs within the entire Facility that match the search query.");
    }
  }

  async getPaginatedUpdateLogsByDivision(divisionID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
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
      throw new Error("Could not get paginated Update Logs within the entire Facility.");
    }
  } 

  async employeeSearchUpdateLogsByDivision(divisionID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      return await paginate({
        model: prisma.updateLog,
        where: {
          divisionID,
          type: { 
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
      throw new Error("Could not get paginated Update Logs within the entire Facility that match the search query.");
    }
  }
}