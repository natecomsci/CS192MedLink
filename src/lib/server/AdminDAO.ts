import { prisma } from "./prisma";

import type { Admin } from '@prisma/client';

import type { CreateAdminDTO, 
              InitialAdminDetailsDTO 
            } from './DTOs';

export class AdminDAO {
  async getByID(adminID: string): Promise<Admin | null> {
    try {
      const admin = await prisma.admin.findUnique({
        where: { 
          adminID 
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

  async create(facilityID: string, data: CreateAdminDTO): Promise<InitialAdminDetailsDTO> {
    try {
      const admin = await prisma.admin.create({
        data: { ...data, facility: { connect: { facilityID } } }
      });
  
      return {
        adminID  : admin.adminID,
        fname    : admin.fname,
        lname    : admin.lname,
        password : admin.password,

        ...(admin.mname ? { mname: admin.mname } : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not create Admin.");
    }
  }

  /*
  async update(adminID: string, data: AdminDTO): Promise<void> {
    try {
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Admin.");
    }
  }
  */

  async delete(adminID: string): Promise<void> {
    try {
      await prisma.admin.delete({
        where: { 
          adminID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not delete Admin.");
    }
  }

  /*
  async getAdminsByFacility(facilityID: string): Promise<[insert]> {
  
  }

  async getPaginatedAdminsByFacility(facilityID: string): Promise<[insert]> {
  
  }

  */
}