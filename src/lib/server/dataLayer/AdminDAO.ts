// @ts-nocheck

import { prisma } from "./prisma";

import { Role } from "@prisma/client";

import { createAndHashPassword, paginate } from "./dataLayerUtility";

import type { AdminDTO,
              CreateAdminDTO,
              UpdateAdminDTO, 
              InitialAdminDetailsDTO,
              FacilityDivisionResultsDTO,
              AdminPreviewDTO,
              PaginatedResultsDTO
            } from "./DTOs";

//

const adminBaseSelect = {
  employeeID : true,
  fname      : true,
  mname      : true,
  lname      : true,
  createdAt  : true,
  updatedAt  : true,
};

const adminDivsSelect = {
  divisions  : { 
    select: { 
      divisionID : true,
      name       : true,
    }
  }
};

function adminSelect(includeDivs = false) {
  return includeDivs ? { ...adminBaseSelect, ...adminDivsSelect } : adminBaseSelect;
}

function mapAdminToDTO(admin: any): AdminDTO {
  return {
    employeeID : admin.employeeID,
    fname      : admin.fname,
    lname      : admin.lname,
    createdAt  : admin.createdAt,
    updatedAt  : admin.updatedAt,

    ...(admin.mname ? { mname: admin.mname } : {}),

    ...(admin.divisions && admin.divisions.length > 0
      ? {
          divisions: admin.divisions.map(({ divisionID, name }: any) => ({
            divisionID,
            name
          })),
        }
      : {})
  };
}

//

export class AdminDAO {
  // generics

  async getByFacility(facilityID: string): Promise<AdminDTO[]> {
    try {
      const admins = await prisma.employee.findMany({
        where: {
          facilityID,
          role: Role.ADMIN
        },
        select: adminSelect(true)
      });

      console.log(`Result of "admins" query for Facility ${facilityID}: `, admins);

      console.log(`Fetched Admins of Facility ${facilityID}: `);

      return admins.map((admin) => (mapAdminToDTO(admin)));
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getByDivision(divisionID: string): Promise<AdminDTO[]> {
    try {
      const admins = await prisma.employee.findMany({
        where: {
          role: Role.ADMIN,
          divisions: {
            some: {
              divisionID
            }
          }
        },
        select: adminSelect()
      });

      console.log(`Result of "admins" query for Division ${divisionID}: `, admins);

      console.log(`Fetched Admins of Division ${divisionID}: `);

      return admins.map((admin) => (mapAdminToDTO(admin)));
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async create(facilityID: string, data: CreateAdminDTO): Promise<InitialAdminDetailsDTO> {
    try {
      const { divisionIDs, ...adminData } = data;

      const { password, hashedPassword } = await createAndHashPassword(); // should be in business logic but whatever

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

          ...(divisionIDs && {
            divisions: {
              connect: divisionIDs.map((divisionID) => ({ divisionID }))
            }
          })
        },
        select: adminSelect(true)
      });

      console.log(`Created Admin ${admin.employeeID}: `, admin);

      console.log(`Initial Admin details: `);

      return {
        adminID  : admin.employeeID,
        fname    : admin.fname,
        lname    : admin.lname,
        password : password,

        ...(admin.mname 
          ? { mname: admin.mname } 
          : {}),
      };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  /*
  Pass Divisions in the following manner:

  Old Divisions:              [div1, div2]

  Updating to keep only div1: [div1]

  Note: You must still include any unchanged Divisions in the array. Omitting a division implies it should be removed.
  */

  async update(adminID: string, data: UpdateAdminDTO): Promise<void> {
    try {
      const { divisionIDs, ...adminData } = data;

      const adminUpdateData = {
        ...adminData,

        ...(divisionIDs && {
          divisions: {
            set: divisionIDs.map((divisionID) => ({ divisionID })) // resets relations; may be inefficient but whatever
          }
        })  
      };

      const admin = await prisma.employee.update({
        where: { 
          employeeID: adminID 
        },
        data: adminUpdateData,
        select: adminSelect(true)
      });

      console.log(`Updated Admin ${adminID}: `, admin);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  // unneeded if we re-put ? sa Create_UpdatedAdminDTO actually you can just use update

  async reconnectDivision(adminID: string, divisionIDs: string[]): Promise<void> {
    try {
      const divisions = await prisma.employee.update({
        where: { 
          employeeID: adminID
        },
        data: {
          divisions: {
            set: divisionIDs.map((divisionID) => ({ divisionID }))
          }
        },
        select: adminDivsSelect
      });

      console.log(`Updated Divisions of Admin ${adminID}: `, divisions.divisions);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async delete(adminID: string): Promise<void> {
    try {
      await prisma.employee.delete({
        where: { 
          employeeID : adminID
        }
      });

      console.log(`Deletion of Admin ${adminID} successful.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getInformation(adminID: string): Promise<AdminDTO> {
    try {
      const admin = await prisma.employee.findUnique({
        where: {
          employeeID: adminID
        },
        select: adminSelect(true)
      });
  
      if (!admin) {
        throw new Error(`No Admin linked to ID ${adminID} found.`);
      }

      console.log(`Fetched information of Admin ${adminID}: `);

      return mapAdminToDTO(admin);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  // for role-based view access

  async getDivisions(adminID: string): Promise<FacilityDivisionResultsDTO[]> {
    try { 
      const divisions = await prisma.employee.findUnique({
        where: { 
          employeeID: adminID 
        },
        select: adminDivsSelect
      });
    
      if (!divisions) {
        throw new Error(`No Divisions linked to ID ${adminID} found.`);
      }

      console.log(`Fetched Divisions of Admin ${adminID}: `);

      return divisions.divisions.map(({ divisionID, name }: any) => ({
        divisionID,
        name
      }));
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  // defer to business logic and just use updatepassword of employeedao

  async resetPassword(adminID: string): Promise<string> {
    try {
      const { password, hashedPassword } = await createAndHashPassword();

      await prisma.employee.update({
        where: { 
          employeeID: adminID 
        },
        data: {
          password: hashedPassword
        }
      });

      console.log(`New password of Admin ${adminID}: `);

      return password;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}

const adminDAO: AdminDAO = new AdminDAO();

export class FacilityAdminListDAO {
  private static adminSearchWhere(query: string) {
    return [
      { fname: { contains: query, mode: "insensitive" } },
      { mname: { contains: query, mode: "insensitive" } },
      { lname: { contains: query, mode: "insensitive" } },
    ];
  }

  async getAdminListPreview(facilityID: string, numberToFetch: number): Promise<AdminPreviewDTO[]> {
    try {
      const admins = await prisma.employee.findMany({
        where: {
          facilityID,
          role: Role.ADMIN
        },
        select: {
          photo : true,
          fname : true,
          mname : true,
          lname : true,
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: numberToFetch
      })

      console.log(`Fetched Admins preview of Facility ${facilityID}: `);

      return admins.map((admin) => ({
        photo : admin.photo,
        fname : admin.fname,
        lname : admin.lname,
    
        ...(admin.mname
          ? { mname: admin.mname }
          : {}),
        }));
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  }

  async getPaginatedAdminsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO<AdminDTO>> {
    try {
      console.log(`Page ${page} of Admins for Facility ${facilityID}: `);

      return await paginate({
        model: prisma.employee,
        where: {
          facilityID,
          role: Role.ADMIN
        },
        select: adminSelect(true),
        orderBy,
        page,
        pageSize,
        mapping: mapAdminToDTO
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  }

  async employeeSearchAdminsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO<AdminDTO>> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of Admins for Facility ${facilityID} matching search query "${query}": `);

      return await paginate({
        model: prisma.employee,
        where: {
          facilityID,
          role: Role.ADMIN,
          OR: FacilityAdminListDAO.adminSearchWhere(query)
        },
        select: adminSelect(true),
        orderBy,
        page,
        pageSize,
        mapping: mapAdminToDTO
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getPaginatedAdminsByDivision(divisionID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO<AdminDTO>> {
    try {
      console.log(`Page ${page} of the list of Division ${divisionID}'s Admins: `);

      return await paginate({
        model: prisma.employee,
        where: {
          role: Role.ADMIN,
          divisions: {
            some: {
              divisionID
            }
          }
        },
        select: adminSelect(),
        orderBy,
        page,
        pageSize,
        mapping: mapAdminToDTO
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  }  

  async employeeSearchAdminsByDivision(divisionID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO<AdminDTO>> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of the list of Division ${divisionID}'s Admins whose name matches the search query "${query}": `);

      return await paginate({
        model: prisma.employee,
        where: {
          role: Role.ADMIN,
          divisions: {
            some: {
              divisionID
            }
          },
          OR: FacilityAdminListDAO.adminSearchWhere(query)
        },
        select: adminSelect(true),
        orderBy,
        page,
        pageSize,
        mapping: mapAdminToDTO
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getSingleDivisionAdmins(facilityID: string): Promise<AdminDTO[]> {
    try {
      const admins = await adminDAO.getByFacility(facilityID);
  
      const singleDivisionAdmins = admins.filter(
        (admin) =>
          (Array.isArray(admin.divisions)) && (admin.divisions.length === 1)
      );
  
      console.log(`Fetched Admins of Facility ${facilityID} with only one Division.`);
  
      return singleDivisionAdmins;
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  }
}