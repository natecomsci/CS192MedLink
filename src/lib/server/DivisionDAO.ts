import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import type { DivisionDTO,
              Create_UpdateDivisionDTO,
              PaginatedDivisionDTO
            } from "./DTOs";

import type { Division } from '@prisma/client';

export class DivisionDAO {
  async getByID(divisionID: string): Promise<Division | null> {
    try {
      const division = await prisma.division.findUnique({
        where: {
          divisionID
        }
      });

      if (!divisionID) {
        console.warn("No Division found with the specified ID.");
        return null;
      }

      return division;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Division.");
    }
  }

  // unsure of output format. are these all needed or kahit ID lang. (ifl ID lang)

  async getByFacility(facilityID: string): Promise<DivisionDTO[]> {
    try {
      const divisions = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: {
          divisionID : true,
          name       : true,
          createdAt  : true,
          updatedAt  : true,
        }
      });

      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Divisions of the facility.");
    }
  }

  async create(facilityID: string, data: Create_UpdateDivisionDTO): Promise<void> {
    try {
      await prisma.division.create({
        data: {
          ...data,
          facility: {
            connect: {
              facilityID
            }
          }
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create Division.");
    }
  }

  async connectServicesToDivision(divisionID: string, data: string[]): Promise<void> {
    try {
      await prisma.division.update({
        where: { 
          divisionID 
        },
        data: {
          services: {
            connect: data.map((serviceID) => ({ serviceID }))
          }
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not connect services to Division.");
    }
  }

  // update

  async delete(divisionID: string): Promise<void> {
    try {
      await prisma.division.delete({
        where: {
          divisionID
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Division.");
    }
  }

  async patientSearchByFacility(query: string, numberToFetch: number, offset: number, facilityID: string): Promise<{ results: DivisionDTO[], hasMore: boolean }> {
    try {
      if (!(query.trim())) {
        return { results: [], hasMore: false };
      }

      const divisions = await prisma.division.findMany({
        where: {
          facilityID,
          name: { 
            contains : query, mode : "insensitive"
          } 
        },
        orderBy: {
          updatedAt: "desc"
        },
        select: {
          divisionID : true,
          name       : true,
          createdAt  : true,
          updatedAt  : true,
        },
        take: numberToFetch + 1,
        skip: offset
      });

      return {
        results: divisions.slice(0, numberToFetch),
        hasMore: divisions.length > numberToFetch,
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not search for Divisions within the facility whose name matches the query.");
    }
  }

  async getPaginatedDivisionsByFacility(facilityID: string, page: number, pageSize: number): Promise<PaginatedDivisionDTO> {
    try {
      const [divisions, totalDivisions] = await Promise.all([
        prisma.division.findMany({
          where: {
            facilityID
          },
          select: {
            divisionID : true,
            name       : true,
            createdAt  : true,
            updatedAt  : true,
          },
          orderBy: {
            updatedAt: "desc"
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.division.count({ 
          where: { 
            facilityID 
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalDivisions / pageSize)); // only needed for admins, etc.

      return { divisions, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated Divisions within the entire facility.");
    }
  }

  async employeeSearchDivisionsByFacility(facilityID: string, query: string, page: number, pageSize: number): Promise<PaginatedDivisionDTO> {
    try {
      if (!(query.trim())) {
        return { divisions: [], totalPages: 1, currentPage: page };
      }

      const [divisions, totalDivisions] = await Promise.all([
        prisma.division.findMany({
          where: {
            facilityID,
            name: { 
              contains: query, mode: "insensitive" 
            }
          },
          select: {
            divisionID : true,
            name       : true,
            createdAt  : true,
            updatedAt  : true,
          },
          orderBy: {
            updatedAt: "desc"
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.division.count({ 
          where: { 
            facilityID,
            name: { 
              contains: query, mode: "insensitive" 
            } 
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalDivisions / pageSize)); // only needed for admins, etc.

      return { divisions, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated Divisions within the entire facility.");
    }
  }
}