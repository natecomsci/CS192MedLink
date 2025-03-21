import { prisma } from "./prisma";

import { Role } from "@prisma/client";

import type { Employee } from '@prisma/client';

// TO ADD: SIGN IN, CHANGE PHOTO AND PASSWORD

export class EmployeeDAO {
  async getByID(employeeID: string): Promise<Employee | null> {
    try {
      const admin = await prisma.employee.findUnique({
        where: { 
          employeeID
        }
      });
  
      if (!admin) {
        console.warn("No Employee with the specified ID found in the facility.");
        return null;
      }
  
      return admin;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Employee.");
    }
  }

  async getRole(employeeID: string): Promise<Role> {
    try {
      const role = await prisma.employee.findUnique({
        where: { 
          employeeID
        },
        select: {
          role: true
        }
      });

      if (!role) {
        throw new Error("Could not get Employee role.");
      }

      return role.role;
    } catch (error) {
        console.error("Details: ", error);
        throw new Error("Could not get Employee role.");
    }
  }
}