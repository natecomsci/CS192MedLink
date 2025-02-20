import { PrismaClient, ServiceType } from '@prisma/client'

import type { Region, POrC } from '@prisma/client';

import { json } from '@sveltejs/kit';

import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO } from './interfaces';


// Initialization of prisma

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DTOs

// Naming Convention: (First Letter of Actor(s) Separated by _)_(View | Create | Update | <Insert Other Action>)<Model Name>DTO
// On the first part: e.g. F corresponds to "Facility" - both Managers and Admins

export async function getRegions(): Promise<RegionDTO[]> {
  const regions = await prisma.region.findMany({
    select: {regionID: true, name: true}
  });

  return regions.map(region => ({
      name: region.name,
      regionID: Number(region.regionID)
    }));
}

export async function getProvinces(regionID: Number): Promise<POrCDTO[]> {
  const provinces = await prisma.pOrC.findMany({
    where: {regionID: String(regionID)},
    select: {pOrCID: true, name: true, regionID: true}
  });

  return provinces.map(province => ({
      name: province.name,
      pOrCID: Number(province.pOrCID),
      regionID: Number(province.regionID)
    }));
}

export async function getCities(provinceID: Number): Promise<COrMDTO[]> {
  const cities = await prisma.cOrM.findMany({
    where: {pOrCID: String(provinceID)},
    select: {pOrCID: true, name: true, cOrMID: true}
  });

  return cities.map(city => ({
      name: city.name,  
      pOrCID: Number(city.pOrCID),
      cOrMID: Number(city.cOrMID)
    }));
}


export function mapModelToRegionDTO(region: Region): RegionDTO {
  return {
    regionID : Number(region.regionID),
    name     : region.name,
    pOrC     : region.pOrC.map(mapModelToPOrCDTO),
  };
}

function mapModelToPOrCDTO(pOrC: POrC): POrCDTO {
  return {
    pOrCID   : pOrC.pOrCID,
    name     : pOrC.name,
    regionID : pOrC.regionID,
    brgy     : pOrC.brgy.map(mapModelToCOrMDTO),
  };
}

export function mapModelToCOrMDTO(cOrM: COrM): COrMDTO {
  return {
    cOrMID : cOrM.cOrMID,
    name   : cOrM.name,
    pOrCID : cOrM.pOrCID,
    brgy   : cOrM.brgy.map(mapModelToBrgyDTO),
  };
}

export function mapModelToBrgyDTO(brgy: Brgy): BrgyDTO {
  return {
    brgyID : brgy.brgyID,
    name   : brgy.name,
    cOrMID : brgy.cOrMID,
  };
}

export function mapFormDataToBrgyDTO(formData: FormData): BrgyDTO {
  const brgyID = formData.get("brgyID");
  const name   = formData.get("name");
  const cOrMID = formData.get("cOrMID");

  if (!name || !cOrMID || !brgyID) {
    throw new Error("Error: One or more data unavailable.");
  }

  return {
    brgyID : parseInt(brgyID as string),
    name   : name as string,
    cOrMID : parseInt(cOrMID as string),
  };
}

export function mapModelToAddressDTO(address: Address): AddressDTO {
  return {
    regionID : address.regionID,
    pOrCID   : address.pOrCID,
    cOrMID   : address.cOrMID,
    brgyID   : address.brgyID,
    street   : address.street,
  };
}

export function mapFormDataToAddressDTO(formData: FormData): AddressDTO {
  const regionID = formData.get("regionID");
  const pOrCID   = formData.get("pOrCID");
  const cOrMID   = formData.get("cOrMID");
  const brgyID   = formData.get("brgyID");
  const street   = formData.get("street");

  if (!regionID || !pOrCID || !cOrMID || !brgyID || !street) {
    throw new Error("Error: One or more data unavailable.");
  }

  return {
    regionID : parseInt(regionID as string),
    pOrCID   : parseInt(pOrCID as string),
    cOrMID   : parseInt(cOrMID as string),
    brgyID   : parseInt(brgyID as string),
    street   : street as string,
  };
}

// The above DTOs have an atypical naming convention kasi yan lang naman talaga kailangang data dyan in any scenario.

// Illustration of functionality ng DTOs : An intermediary between DAOs and the database containing only necessary information for specific scenarios.



// No <Actor>_CreateFacilityDTO because Facilities are created externally.

// TO ADD MORE DTOs AND MAPPING FUNCTIONS

// DAOs

export class FacilityDAO { // call functions under these DAOs sa page.server.ts instead of writing raw commands there.
  // attributes
  attributeName: string;

  constructor(input: string) {
    this.attributeName = input;
  }

  static async deleteFacility(facilityID: string) { // this function has no actual associated use case. sample lang to.
    try {
      const facilityToDelete = await prisma.facility.delete({
        where: { facilityID },
      });

      return facilityToDelete;
    } catch (error) {
      throw new Error("Could not delete the facility.");
    }
  }
}

//

export class ServiceDAO { // to hell with making this an interface for now sorry Sir Juancho. i-if else nyo nalang sa business logic layer.

  static async getAmbulanceService(facilityID: string) {
    const ambulanceService = await prisma.ambulanceService.findUnique({
      where: { facilityID },
      select: {
        phoneNumber       : true,
        openingTime       : true,
        closingTime       : true,
        baseRate          : true,
        minCoverageRadius : true,
        mileageRate       : true,
        maxCoverageRadius : true,
        availability      : true,
      }
    });
  }

  static async getBloodBankService(facilityID: string) {

  }

  static async getERService(facilityID: string) {
    
  }

  static async getICUService(facilityID: string) {
    
  }

  static async getOutpatientService(facilityID: string, serviceType: ServiceType) { // serviceType needs mapping
    
  }

  static async createAmbulanceService( ) {

  }

  static async createBloodBankService( ) {

  }

  static async createERService( ) {
    
  }

  static async createICUService( ) {
    
  }

  static async createOutpatientService( ) {
    
  }

  // TO ADD UPDATE FUNCTIONS

  static async deleteAmbulanceService(facilityID: string) {
    try {
      const ambulanceServiceToDelete = await prisma.ambulanceService.delete({
        where: { facilityID },
      });

      return ambulanceServiceToDelete;
    } catch (error) {
      throw new Error("Could not delete the AmbulanceService.");
    }
  }

  static async deleteBloodBankService(facilityID: string) {
    try {
      const bloodBankServiceToDelete = await prisma.bloodBankService.delete({
        where: { facilityID },
      });

      return bloodBankServiceToDelete;
    } catch (error) {
      throw new Error("Could not delete the BloodBankService.");
    }
  }

  static async deleteERService(facilityID: string) {
    try {
      const eRServiceToDelete = await prisma.eRService.delete({
        where: { facilityID },
      });

      return eRServiceToDelete;
    } catch (error) {
      throw new Error("Could not delete the ERService.");
    }
  }

  static async deleteICUService(facilityID: string) {
    try {
      const iCUServiceToDelete = await prisma.iCUService.delete({
        where: { facilityID },
      });

      return iCUServiceToDelete;
    } catch (error) {
      throw new Error("Could not delete the ICUService.");
    }
  }

  static async deleteOutpatientService(facilityID: string) {
    try {
      const outpatientServiceToDelete = await prisma.outpatientService.delete({
        where: { facilityID },
      });

      return outpatientServiceToDelete;
    } catch (error) {
      throw new Error("Could not delete the ICUService.");
    }
  }

  // TO ADD MORE SHIT
}
