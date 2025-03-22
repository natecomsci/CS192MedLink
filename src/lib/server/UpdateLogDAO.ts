import { prisma } from "./prisma";

import { Prisma } from "@prisma/client";

import type { UpdateLogDTO, 
              CreateUpdateLogDTO, 
              PaginatedUpdateLogDTO 
            } from "./DTOs";

export class UpdateLogDAO {
  async createUpdateLog(data: CreateUpdateLogDTO, facilityID: string, employeeID: string, tx: Prisma.TransactionClient): Promise<void> {
    await tx.updateLog.create({
      data: {
        ...data,
        facility : {
          connect: {
            facilityID
          },
        },
        employee : {
          connect: {
            employeeID
          }
        }
      }
    });
  }

  async getPaginatedUpdateLogsByFacility(facilityID: string, page: number, pageSize: number): Promise<PaginatedUpdateLogDTO> {
    try {
      const [updateLogs, totalUpdateLogs] = await Promise.all([
        prisma.updateLog.findMany({
          where: { 
            facilityID 
          },
          select: {
            entity     : true,
            action     : true,
            employeeID : true,
            createdAt  : true,
          },
          orderBy: { 
            createdAt: "desc" 
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.updateLog.count({
          where: { 
            facilityID
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalUpdateLogs / pageSize));
  
      return { updateLogs, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated update logs within the entire facility.");
    }
  }
  
  async employeeSearchUpdateLogsByFacility(facilityID: string, query: string, page: number, pageSize: number): Promise<PaginatedUpdateLogDTO> {
    try {
      if (!(query.trim())) {
        return { updateLogs: [], totalPages: 1, currentPage: page };
      }

      const [updateLogs, totalUpdateLogs] = await Promise.all([
        prisma.updateLog.findMany({
          where: {
            facilityID,
            entity: { 
              contains: query, mode: "insensitive" 
            }
          },
          select: {
            entity       : true,
            action     : true,
            employeeID : true,
            createdAt  : true,
          },
          orderBy: { 
            createdAt: "desc" 
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.updateLog.count({
          where: { 
            facilityID,
            entity: { 
              contains: query, mode: "insensitive" 
            } 
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil(totalUpdateLogs / pageSize));
  
      return { updateLogs, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated update logs within the entire facility.");
    }
  }
}