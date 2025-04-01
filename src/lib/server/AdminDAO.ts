// @ts-nocheck comment at the top of a file

import { prisma } from "./prisma";

import { Role } from "@prisma/client";

import { createAndHashPassword, paginate } from "./dataLayerUtility";

import type { AdminDTO,
              Create_UpdateAdminDTO, 
              InitialAdminDetailsDTO,
              FacilityDivisionPageResultsDTO,
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
    employeeID: admin.employeeID,
    fname: admin.fname,
    lname: admin.lname,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,

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

      console.log(`Admins of Facility ${facilityID}: `);

      return admins.map((admin) => (mapAdminToDTO(admin)));
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Admins of the Facility.");
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

      console.log(`Admins of Division ${divisionID}: `);

      return admins.map((admin) => (mapAdminToDTO(admin)));
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Admins of the Division.");
    }
  }

  async create(facilityID: string, data: Create_UpdateAdminDTO): Promise<InitialAdminDetailsDTO> {
    try {
      const { divisions, ...adminData } = data;

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

          ...(divisions && {
            divisions: {
              connect: divisions.map((divisionID) => ({ divisionID }))
            }
          }),          
        }
      });

      console.log(`Created Admin: `, admin);

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
      throw new Error("Could not create Admin.");
    }
  }

  /*
  Pass Divisions in the following manner:

  Old Divisions:              [div1, div2]

  Updating to keep only div1: [div1]

  Note: You must still include any unchanged Divisions in the array. Omitting a division implies it should be removed.
  */

  async update(adminID: string, data: Create_UpdateAdminDTO): Promise<void> {
    try {
      const { divisions, ...adminData } = data;

      const adminUpdateData = {
        ...adminData,
        ...(divisions && {
          divisions: {
            set: divisions.map((divisionID) => ({ divisionID })) // resets relations; may be inefficient but whatever
          }
        }),  
      };

      const admin = await prisma.employee.update({
        where: { 
          employeeID: adminID 
        },
        data: adminUpdateData
      });
      
      console.log(`Updated Admin: `, admin);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not update Admin.");
    }
  }

  // unneeded if we re-put ? sa Create_UpdatedAdminDTO actually you can just use update

  async reconnectDivision(adminID: string, divisionIDs: string[]): Promise<void> {
    try {
      const admin = await prisma.employee.update({
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

      console.log(`Updated Divisions of Admin: `, admin.divisions.map((division) => division.divisionID));
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not connect Admin to Divisions.");
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

  async getInformation(adminID: string): Promise<AdminDTO> {
    try {
      const admin = await prisma.employee.findUnique({
        where: {
          employeeID: adminID
        },
        select: adminSelect(true)
      });
  
      if (!admin) {
        throw new Error("Admin not found.");
      }

      return mapAdminToDTO(admin);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get information for Admin.");
    }
  }

  // for role-based view access

  async getDivisions(adminID: string): Promise<FacilityDivisionPageResultsDTO[]> { 
    const divisions = await prisma.employee.findUnique({
      where: { 
        employeeID: adminID 
      },
      select: adminDivsSelect
    });
  
    if (!divisions) {
      throw new Error("No Admin with the specified ID found.");
    }
  
    return divisions.divisions.map(({ divisionID, name }: any) => ({
      divisionID,
      name
    }));
  }

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
      
      return password;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not reset Admin password.");
    }
  }
}

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
      throw new Error("Could not get Admins preview.");
    }
  }

  //

  async getPaginatedAdminsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
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
      throw new Error("Could not get paginated Admins within the entire Facility.");
    }
  }  

  async employeeSearchAdminsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

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
      throw new Error("Could not get paginated Admins within the entire Facility that match the search query.");
    }
  }

  //

  async getPaginatedAdminsByDivision(divisionID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
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
      throw new Error("Could not get paginated Admins within the Division.");
    }
  }  

  async employeeSearchAdminsByDivision(divisionID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

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
      throw new Error("Could not get paginated Admins within the Division that match the search query.");
    }
  }

  //

  // may or may not optimize

  async getPaginatedSingleDivisionAdmins(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO> {
    try {
      const paginatedAdmins = await this.getPaginatedAdminsByFacility(facilityID, page, pageSize, orderBy);

      const singleDivisionAdmins = paginatedAdmins.results.filter(
        (admin) =>
          (Array.isArray(admin.divisions)) && (admin.divisions.length === 1)
      );

      const totalPages = Math.max(
        1,
        Math.ceil(singleDivisionAdmins.length / pageSize)
      );
  
      return { results: singleDivisionAdmins, totalPages, currentPage: page };
    } catch (error) {
      console.error("Details:", error);
      throw new Error("Could not get paginated Admins related to only one Division.");
    }
  }
}