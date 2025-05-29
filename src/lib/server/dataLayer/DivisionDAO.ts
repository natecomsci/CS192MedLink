// @ts-nocheck

import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { ContactType, Action }  from "@prisma/client";

import type { Division } from '@prisma/client';

import { paginate, loadMore } from "./dataLayerUtility";

import { ContactDAO } from "./ContactDAO";

import { UpdateLogDAO } from "./UpdateLogDAO";

import type { DivisionDTO,
              CreateDivisionDTO,
              UpdateDivisionDTO,
              MultiServiceDivisionsDTO,
              LoadMoreResultsDTO,
              PaginatedResultsDTO,
              FacilityDivisionResultsDTO
            } from "./DTOs";

const divisionBaseSelect = {
  divisionID : true,
  name       : true,
}

const divisionCrUpSelect = {
  createdAt  : true,
  updatedAt  : true,
};

function divisionSelect(includeCrUp = false) {
  return includeCrUp ? { ...divisionBaseSelect, ...divisionCrUpSelect } : divisionBaseSelect;
}

const contactDAO: ContactDAO = new ContactDAO();

const updateLogDAO: UpdateLogDAO = new UpdateLogDAO(); // could inject this but whatever lol

export class DivisionDAO {
  // generics

  async getByID(divisionID: string): Promise<Division> {
    try {
      const division = await prisma.division.findUnique({
        where: {
          divisionID
        }
      });

      if (!division) {
        throw new Error(`No Division linked to ID ${divisionID} found.`);
      }

      console.log(`Fetched Division ${divisionID}: `);
  
      return division;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getByFacility(facilityID: string): Promise<DivisionDTO[]> {
    try {
      const divisions = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: divisionSelect(true)
      });

      console.log(`Fetched Divisions of Facility ${facilityID}: `);

      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  //

  async create(facilityID: string, employeeID: string, data: CreateDivisionDTO): Promise<string> {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { email, phoneNumber, ...divisionData } = data;

        const division = await tx.division.create({
          data: {
            ...divisionData,
            facility: {
              connect: { 
                facilityID 
              }
            }
          }
        });

        if (email && email.length) {
          await contactDAO.createMany(
            "division",
            division.divisionID,
            email.map((info) => ({
              info,
              type: ContactType.EMAIL
            })),
            tx
          );
        }

        await contactDAO.createMany(
          "division",
          division.divisionID,
          phoneNumber.map((info) => ({
            info,
            type: ContactType.PHONE
          })),
          tx
        );

        await updateLogDAO.create(
          {
            entity     : data.name,
            action     : Action.CREATE,
            divisionID : division.divisionID
          },
          facilityID,
          employeeID,
          tx
        );
  
        console.log(`Created Division ${division.divisionID}: `, division);

        return division.divisionID;
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }  

  async connectServices(divisionID: string, serviceIDs: string[]): Promise<void> {
    try {
      await prisma.service.updateMany({
        where: {
          serviceID: { 
            in: serviceIDs
          }
        },
        data: {
          divisionID
        }
      });

      console.log(`Services successfully connected to Division ${divisionID}.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async update(divisionID: string, facilityID: string, employeeID: string, data: UpdateDivisionDTO): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const { email, phoneNumber, ...divisionData } = data;

        const division = await tx.division.update({
          where: { 
            divisionID 
          },
          data
        });

        // email = [] means delete everything

        if (email) {
          await contactDAO.deleteMany("division", divisionID, ContactType.EMAIL, tx);
  
          if (email.length > 0) {
            await contactDAO.createMany(
              "division",
              divisionID,
              email.map((info) => ({
                info,
                type: ContactType.EMAIL
              })),
              tx
            );
          }
        }

        // phoneNumber = [] means delete everything

        if (phoneNumber) {
          await contactDAO.deleteMany("division", divisionID, ContactType.PHONE, tx);
  
          if (phoneNumber.length > 0) {
            await contactDAO.createMany(
              "division",
              divisionID,
              phoneNumber.map((info) => ({
                info,
                type: ContactType.PHONE
              })),
              tx
            );
          }
        }

        await updateLogDAO.create(
          {
            entity     : division.name,
            action     : Action.UPDATE,
            divisionID : division.divisionID
          },
          facilityID,
          employeeID,
          tx
        );
  
        console.log(`Updated Division ${divisionID}: `, division);
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async delete(divisionID: string, facilityID: string, employeeID: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const division = await tx.division.findUnique({
          where: { 
            divisionID 
          },
          select: { 
            name       : true, 
            divisionID : true,
          }
        });
  
        if (!division) {
          throw new Error(`No Division linked to ID ${divisionID} found.`);
        }

        await updateLogDAO.create(
          {
            entity : division.name,
            action : Action.DELETE,
          },
          facilityID,
          employeeID,
          tx
        );
  
        await tx.division.delete({
          where: { 
            divisionID 
          }
        });
      });

      console.log(`Deletion of Division ${divisionID} successful.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }  

  async getInformation(divisionID: string): Promise<CreateDivisionDTO> {
    try {
      const division = await prisma.division.findUnique({
        where: { 
          divisionID 
        },
        select: {
          name        : true,
          openingTime : true,
          closingTime : true,
        }
      });    

      if (!division) {
        throw new Error(`No Division linked to ID ${divisionID} found.`);
      }

      const phoneNumber = await contactDAO.getPhoneNumbersByDivision(divisionID);

      const email = await contactDAO.getEmailsByFacility(divisionID);

      console.log(`Fetched information of Division ${divisionID}: `);

      return {
        name        : division.name,
        openingTime : division.openingTime,
        closingTime : division.closingTime,
        phoneNumber,

        ...(email.length ? { email } : {})
      }
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async divisionHasServices(divisionID: string): Promise<boolean> {
    try {
      const count = await prisma.service.count({
        where: {
          divisionID
        }
      });

      console.log(`Does Division ${divisionID} have Services?`);

      return count > 0;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getAllNamesByFacility(facilityID: string): Promise<string[]> {
    try {
      const divisions = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: {
          name: true
        }
      });
  
      console.log(`Fetched Division names of Facility ${facilityID}.`);
  
      return divisions.map((division) => division.name);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}

export class PatientDivisionListDAO {
  async getLoadMoreDivisionsByFacility(facilityID: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO<FacilityDivisionResultsDTO>> {
    try {
      console.log(`Loaded more Divisions for Facility ${facilityID} (offset: ${offset}): `);

      return await loadMore({
        model: prisma.division,
        where: { 
          facilityID
        },
        select: divisionSelect(),
        orderBy,
        offset,
        numberToFetch
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async patientSearchDivisionsByFacility(facilityID: string, query: string, numberToFetch: number, offset: number, orderBy: any): Promise<LoadMoreResultsDTO<FacilityDivisionResultsDTO>> {
    try {
      if (!(query.trim())) {
        return { results: [], totalResults: 0, totalFetched: 0, hasMore: false };
      }

      console.log(`Loaded more Divisions for Facility ${facilityID} (offset: ${offset}) matching search query "${query}": `);

      return await loadMore({
        model: prisma.division,
        where: { 
          facilityID,
          name: { 
            contains: query, mode: "insensitive" 
          } 
        },
        select: divisionSelect(),
        orderBy,
        offset,
        numberToFetch
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}

export class FacilityDivisionListDAO {
  async getDivisionListPreview(facilityID: string, numberToFetch: number): Promise<string[]> {
    try {
      const divisions = await prisma.division.findMany({
        where: {
          facilityID
        },
        select: {
          name: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: numberToFetch
      })

      console.log(`Fetched Divisions preview of Facility ${facilityID}: `);

      return divisions.map((division) => division.name);
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async getPaginatedDivisionsByFacility(facilityID: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO<DivisionDTO>> {
    try {
      console.log(`Page ${page} of Divisions for Facility ${facilityID}: `);

      return await paginate({
        model: prisma.division,
        where: {
          facilityID
        },
        select: divisionSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details:", error);
      throw new Error("No database connection.");
    }
  } 

  async employeeSearchDivisionsByFacility(facilityID: string, query: string, page: number, pageSize: number, orderBy: any): Promise<PaginatedResultsDTO<DivisionDTO>> {
    try {
      if (!(query.trim())) {
        return { results: [], totalPages: 1, currentPage: page };
      }

      console.log(`Page ${page} of Divisions for Facility ${facilityID} matching search query "${query}": `);

      return await paginate({
        model: prisma.division,
        where: {
          facilityID,
          name: { 
            contains: query, mode: "insensitive" 
          }
        },
        select: divisionSelect(true),
        orderBy,
        page,
        pageSize
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getMultiServiceDivisions(facilityID: string): Promise<MultiServiceDivisionsDTO[]> {
    try {
      const multiServiceDivisionIDs = await prisma.service.groupBy({
        by: ["divisionID"],
        where: {
          division: {
            facilityID
          }
        },
        having: {
          divisionID: {
            _count: {
              gt: 1
            }
          }
        }
      });
  
      const divisionIDs = multiServiceDivisionIDs.map(division => division.divisionID).filter((divisionID): divisionID is string => (divisionID !== null));
  
      if (divisionIDs.length === 0) {
        return [];
      }
  
      const divisions = await prisma.division.findMany({
        where: {
          divisionID: { 
            in: divisionIDs 
          }
        },
        select: {
          ...divisionSelect(),
          services: {
            select: {
              serviceID : true,
              type      : true,
            }
          }
        }
      });

      console.log(`Fetched list of Facility ${facilityID}'s Divisions with multiple services: `);

      return divisions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}