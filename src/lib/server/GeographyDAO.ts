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

      console.log(`Regions: `, regions)

      return regions;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Regions.");
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
        throw new Error("No Region found.");
      }

      console.log(`Region name: `, object.name)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the Region.");
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

      console.log(`Provinces of ${await this.getNameOfRegion(regionID)}: `, pOrCs)

      return pOrCs;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Provinces under the Region.");
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
        throw new Error("No Province found.");
      }

      console.log(`Province name: `, object.name)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the Province.");
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

      console.log(`Cities or Municipalities of ${await this.getNameOfProvince(pOrCID)}: `, cOrMs)

      return cOrMs;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Cities or Municipalities under the Province.");
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
        throw new Error("No COrM found.");
      }

      console.log(`City or Municipality name: `, object.name)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the City or Municipality.");
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

      console.log(`Barangays of ${await this.getNameOfCOrM(cOrMID)}: `, brgys)

      return brgys;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Barangays under the City or Municipality.");
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
        throw new Error("No Barangay found.");
      }

      console.log(`Barangay name: `, object.name)

      return object.name;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get name of the Barangay.");
    }
  }
}