import { prisma } from "./prisma";

import { Role } from "@prisma/client";

import type { Employee } from '@prisma/client';

import type { AdminDTO,
              Create_UpdateAdminDTO, 
              InitialAdminDetailsDTO,
              PaginatedAdminDTO
            } from './DTOs';

import generator from "generate-password-ts";

import bcrypt from "bcryptjs";

export class AdminDAO {
  async getByID(adminID: string): Promise<Employee | null> {
    try {
      const admin = await prisma.employee.findUnique({
        where: { 
          employeeID : adminID 
        }
      });
  
      if (!admin) {
        console.warn("No Admin with the specified ID found in the facility.");
        return null;
      }
  
      return admin;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Admin.");
    }
  }

  async createAndHashPassword(): Promise<{ password: string, hashedPassword: string }> {
      const password: string = generator.generate({
        length  : 10,
        numbers : true,
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      return { password, hashedPassword };
  }

  async create(facilityID: string, data: Create_UpdateAdminDTO): Promise<InitialAdminDetailsDTO> {
    try {
      const { divisions, ...adminData } = data;

      const { password, hashedPassword } = await this.createAndHashPassword();

      const admin = await prisma.employee.create({
        data: {
          ...adminData,
          password : hashedPassword,
          role     : Role.ADMIN,
          facility : { 
            connect: { 
              facilityID 
            } 
          },

          ...((divisions !== undefined) && {
            divisions: {
              connect: divisions.map((divisionID) => ({ divisionID }))
            }
          }),          
        }
      });

      return {
        adminID  : admin.employeeID,
        fname    : admin.fname,
        lname    : admin.lname,
        password : password,

        ...(admin.mname ? { mname: admin.mname } : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create Admin.");
    }
  }

  async getInformation(employeeID: string): Promise<AdminDTO> {
    try {
      const admin = await prisma.employee.findUnique({
        where: {
          employeeID
        },
        select: {
          employeeID : true,
          fname      : true,
          mname      : true,
          lname      : true,
          divisions  : {
            select: {
              divisionID: true
            }
          },
          createdAt  : true,
          updatedAt  : true,
          role       : true,
        }
      });
  
      if (!admin || admin.role !== Role.ADMIN) {
        throw new Error("Admin not found.");
      }
  
      return {
        employeeID : admin.employeeID,
        fname      : admin.fname,
        lname      : admin.lname,
        createdAt  : admin.createdAt,
        updatedAt  : admin.updatedAt,
  
        ...(admin.mname ? { mname: admin.mname } : {}),
        ...(admin.divisions.length > 0
          ? {
              divisions: admin.divisions.map((division) => division.divisionID),
            }
          : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for Admin.");
    }
  }

  async update(adminID: string, data: Create_UpdateAdminDTO): Promise<void> {
    try {
      const { divisions, ...adminData } = data;

      const adminUpdateData = {
        ...adminData,
        ...((divisions !== undefined) && {
          divisions: {
            connect: divisions.map((divisionID) => ({ divisionID }))
          }
        }),  
      };

      await prisma.employee.update({
        where: { 
          employeeID: adminID 
        },
        data: adminUpdateData
      });
      
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Admin.");
    }
  }

  async resetPassword(adminID: string): Promise<string> {
    try {
      const { password, hashedPassword } = await this.createAndHashPassword();

      await prisma.employee.update({
        where: { 
          employeeID: adminID 
        },
        data: {
          password: hashedPassword
        }
      });
      
      return password;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not reset Admin password.");
    }
  }

  async delete(adminID: string): Promise<void> {
    try {
      await prisma.employee.delete({
        where: { 
          employeeID : adminID
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Admin.");
    }
  }

  async getPaginatedAdminsByFacility(facilityID: string, page: number, pageSize: number): Promise<PaginatedAdminDTO> {
    try {
      const [admins, totalAdmins] = await Promise.all([
        prisma.employee.findMany({
          where: {
            facilityID,
            role: Role.ADMIN
          },
          select: {
            employeeID : true,
            fname      : true,
            mname      : true,
            lname      : true,
            divisions  : { 
              select: { 
                divisionID: true 
              } 
            },
            createdAt  : true,
            updatedAt  : true,
          },
          orderBy: {
            updatedAt: "desc"
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.employee.count({ 
          where: { 
            facilityID,
            role: Role.ADMIN
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil((totalAdmins) / pageSize));

      return {
        admins: admins.map((admin) => ({
          employeeID : admin.employeeID,
          fname      : admin.fname,
          lname      : admin.lname,
          createdAt  : admin.createdAt,
          updatedAt  : admin.updatedAt,

          ...(admin.mname ? { mname: admin.mname } : {}),
          ...(admin.divisions
            ? admin.divisions.map((division) => division.divisionID)
            : {}),
        })),
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated admins within the entire facility.");
    }
  }

  async employeeSearchAdminsByFacility(facilityID: string, query: string, page: number, pageSize: number): Promise<PaginatedAdminDTO> {
    try {
      if (!(query.trim())) {
        return { admins: [], totalPages: 1, currentPage: page };
      }

      const [admins, totalAdmins] = await Promise.all([
        prisma.employee.findMany({
          where: {
            facilityID,
            role: Role.ADMIN,
            OR: [
              { fname: { contains: query, mode: "insensitive" } },
              { mname: { contains: query, mode: "insensitive" } },
              { lname: { contains: query, mode: "insensitive" } },
            ]
          },
          select: {
            employeeID : true,
            fname      : true,
            mname      : true,
            lname      : true,
            divisions  : { 
              select: { 
                divisionID: true 
              } 
            },
            createdAt  : true,
            updatedAt  : true,
          },
          orderBy: {
            updatedAt: "desc"
          },
          skip: (Math.max(1, page) - 1) * pageSize,
          take: pageSize
        }),
        prisma.employee.count({ 
          where: { 
            facilityID,
            role: Role.ADMIN
          }
        })
      ]);
  
      const totalPages = Math.max(1, Math.ceil((totalAdmins) / pageSize));

      return {
        admins: admins.map((admin) => ({
          employeeID : admin.employeeID,
          fname      : admin.fname,
          lname      : admin.lname,
          createdAt  : admin.createdAt,
          updatedAt  : admin.updatedAt,

          ...(admin.mname ? { mname: admin.mname } : {}),
          ...(admin.divisions
            ? admin.divisions.map((division) => division.divisionID)
            : {}),
        })),
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get paginated services within the entire facility.");
    }
  }
}