import { prisma } from "./prisma";

import { Prisma } from '@prisma/client'

import type { RegionDTO, 
              POrCDTO, 
              COrMDTO, 
              BrgyDTO, 
              AddressDTO 
            } from './DTOs';

export class AddressDAO {
  async updateAddress(facilityID: string, data: AddressDTO, tx: Prisma.TransactionClient): Promise<void> {
    await tx.address.update({
      where: { 
        facilityID 
      },
      data: {
        regionID : data.regionID,
        pOrCID   : data.pOrCID,
        cOrMID   : data.cOrMID,
        brgyID   : data.brgyID,
        street   : data.street,
      }
    });
  }

  async getRegions(): Promise<RegionDTO[]> {
    try {
      const regions = await prisma.region.findMany({
        select: {
          regionID : true, 
          name     : true,
        }
      });

      return regions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get regions.");
    }
  }

  async getNameOfRegion(regionID: number): Promise<string | null> {
    try {
      const object = await prisma.region.findUnique({
        where: {
          regionID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No Region found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the region.");
    }
  }

  async getProvinceOfRegion(regionID: number): Promise<POrCDTO[]> {
    try {
      const pOrC = await prisma.pOrC.findMany({
        where: {
          regionID
        },
        select: {
          pOrCID   : true,
          name     : true,
          regionID : true,
        }
      });

      return pOrC;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get provinces for the region.");
    }
  }

  async getNameOfProvince(pOrCID: number): Promise<string | null> {
    try {
      const object = await prisma.pOrC.findUnique({
        where: {
          pOrCID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No Province found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the province.");
    }
  }

  async getCOrMOfProvince(pOrCID: number): Promise<COrMDTO[]> {
    try {
      const cOrMs = await prisma.cOrM.findMany({
        where: { 
          pOrCID 
        },
        select: {
          cOrMID : true,
          name   : true,
          pOrCID : true,
        }
      });

      return cOrMs;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get cities or municipalities for the province.");
    }
  }

  async getNameOfCOrM(cOrMID: number): Promise<string | null> {
    try {
      const object = await prisma.cOrM.findUnique({
        where: {
          cOrMID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No COrM found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the city or municipality.");
    }
  }

  async getBrgyOfCOrM(cOrMID: number): Promise<BrgyDTO[]> {
    try {
      const brgys = await prisma.brgy.findMany({
        where: { 
          cOrMID 
        },
        select: {
          brgyID : true,
          name   : true,
          cOrMID : true,
        }
      });

      return brgys;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get barangays for the city or municipality.");
    }
  }

  async getNameOfBrgy(brgyID: number): Promise<string | null> {
    try {
      const object = await prisma.brgy.findUnique({
        where: {
          brgyID
        },
        select: {
          name : true
        }
      });

      if (!object) {
        console.warn("No Barangay found.");
        return null;
      }

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the barangay.");
    }
  }
}
