import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { Role } from "@prisma/client";

import type { Employee } from '@prisma/client';

import bcrypt from "bcryptjs";

// DAO FOR METHODS THAT MANAGERS AND ADMINS SHARE

// TO ADD: UPDATE PHOTO

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

  // gets hashed password. to compare using bcrypt.compare in business logic ?

  async getPassword(employeeID: string): Promise<string> {
    try {
      const password = await prisma.employee.findUnique({
        where: { 
          employeeID
        },
        select: {
          password: true
        }
      });

      if (!password) {
        throw new Error("Could not get Employee role.");
      }

      return password.password;
    } catch (error) {
        console.error("Details: ", error);
        throw new Error("Could not get Employee password.");
    }
  }

  async updatePassword(employeeID: string, password: string): Promise<void> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword: string = await bcrypt.hash(password, salt);

      await prisma.employee.update({
        where: { 
          employeeID 
        },
        data: {
          password: hashedPassword
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Employee password.");
    }
  }

  async updatePhoto(employeeID: string, photoUrl: string): Promise<void> {
    try {
      await prisma.employee.update({
        where: { employeeID },
        data: { photo: photoUrl },
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Employee photo.");
    }
  }

}