import { prisma } from "./prisma";

import type { RegionDTO, 
              POrCDTO, 
              COrMDTO, 
              BrgyDTO, 
              AddressDTO 
            } from "./DTOs";

export class GeographyDAO {
  async getRegions(): Promise<RegionDTO[]> {
    try {
      const regions = await prisma.region.findMany({
        select: {
          regionID : true, 
          name     : true,
        }
      });

      console.log(`Regions: `)

      return regions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getNameOfRegion(regionID: number): Promise<string> {
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
        throw new Error(`No Region linked to ID ${regionID} found.`);
      }

      console.log(`Region name: `)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getProvinceOfRegion(regionID: number): Promise<POrCDTO[]> {
    try {
      const pOrCs = await prisma.pOrC.findMany({
        where: {
          regionID
        },
        select: {
          pOrCID   : true,
          name     : true,
          regionID : true,
        }
      });

      console.log(`Provinces of ${await this.getNameOfRegion(regionID)}: `)

      return pOrCs;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getNameOfProvince(pOrCID: number): Promise<string> {
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
        throw new Error(`No Province linked to ID ${pOrCID} found.`);
      }

      console.log(`Province name: `)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Cities or Municipalities of ${await this.getNameOfProvince(pOrCID)}: `)

      return cOrMs;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getNameOfCOrM(cOrMID: number): Promise<string> {
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
        throw new Error(`No City or Municipality linked to ID ${cOrMID} found.`);
      }

      console.log(`City or Municipality name: `)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
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

      console.log(`Barangays of ${await this.getNameOfCOrM(cOrMID)}: `)

      return brgys;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getNameOfBrgy(brgyID: number): Promise<string> {
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
        throw new Error(`No Barangay linked to ID ${brgyID} found.`);
      }

      console.log(`Barangay name: `)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}
