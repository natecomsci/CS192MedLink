import { prisma } from "./prisma";

import { Role } from "@prisma/client";

import type { Employee } from '@prisma/client';

import { FacilityDAO } from "./FacilityDAO";

import { AdminDAO } from "./AdminDAO";

import bcrypt from "bcryptjs";

const facilityDAO: FacilityDAO = new FacilityDAO();

const adminDAO: AdminDAO = new AdminDAO();

// DAO FOR METHODS THAT MANAGERS AND ADMINS SHARE

// TO ADD: UPDATE PHOTO

export class EmployeeDAO {
  // generics

  async getByID(employeeID: string): Promise<Employee> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { 
          employeeID
        }
      });
  
      if (!employee) {
        throw new Error(`No Employee linked to ID ${employeeID} found.`);
      }

      console.log(`Fetched Employee ${employeeID}: `);

      return employee;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  //

  async getRole(employeeID: string): Promise<Role> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { 
          employeeID
        },
        select: {
          role: true
        }
      });

      if (!employee) {
        throw new Error(`No Employee linked to ID ${employeeID} found.`);
      }

      return employee.role;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  // gets hashed password. to compare using bcrypt.compare in business logic ?

  async getPassword(employeeID: string): Promise<string> {
    try {
      const employee = await prisma.employee.findUnique({
        where: { 
          employeeID
        },
        select: {
          password: true
        }
      });

      if (!employee) {
        throw new Error(`No Employee linked to ID ${employeeID} found.`);
      }

      return employee.password;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async updatePassword(employeeID: string, password: string): Promise<void> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const employee = await prisma.employee.update({
        where: { 
          employeeID 
        },
        data: {
          password: hashedPassword
        }
      });

      console.log(`New password of Employee ${employeeID}: `, employee.password);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async updatePhoto(employeeID: string, url: string): Promise<void> {
    try {
      const employee = await prisma.employee.update({
        where: { 
          employeeID 
        },
        data: {
          photo: url
        }
      });

      console.log(`New photo url of Employee ${employeeID}: `, employee.photo);

    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Employee photo.");
    }
  }
}

const employeeDAO: EmployeeDAO = new EmployeeDAO();

// where clause utility ,, they do not like you at dataLayerUtility

export async function getEmployeeScopedWhereClause(
  facilityID      : string,
  employeeID      : string,
  query?          : string,
  queryAttribute? : string,
): Promise<any> {
  const baseWhere: any = {
    facilityID // redundant if Admin but more secure
  };

  if (query) {
    if (query.trim() && queryAttribute) {
      baseWhere[queryAttribute] = {
        contains: query, mode: "insensitive"
      };
    }
  }

  const role = await employeeDAO.getRole(employeeID);

  if (role === Role.ADMIN) {
    const hasDivisions = await facilityDAO.facilityHasDivisions(facilityID);

    if (hasDivisions) {
      const divisions = await adminDAO.getDivisions(employeeID);

      const divisionIDs = divisions.map((division) => division.divisionID);

      baseWhere.divisionID = { 
        in: divisionIDs
      };
    }
  }

  return baseWhere;
}