import { PrismaClient } from '@prisma/client'

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prisma;
}

export { prisma }

// DTOs

// Naming Convention: (First Letter of Actor(s) Separated by _)_(View | Create | Update | <Insert Other Action>)<Model Name>DTO
// On the first part: e.g. F corresponds to "Facility" - both Managers and Admins

export interface RegionDTO {
  regionID : number;
  name     : string;
  pOrC     : POrCDTO[];
}

export function mapModelToRegionDTO(region: Region): RegionDTO {
  return {
    regionID : region.regionID,
    name     : region.name,
    pOrC     : region.pOrC.map(mapModelToPOrCDTO),
  };
}

export interface POrCDTO {
  pOrCID   : number;
  name     : string;
  regionID : number;
  brgy     : COrMDTO[];
}

function mapModelToPOrCDTO(pOrC: POrC): POrCDTO {
  return {
    pOrCID   : pOrC.pOrCID,
    name     : pOrC.name,
    regionID : pOrC.regionID,
    brgy     : pOrC.brgy.map(mapModelToCOrMDTO),
  };
}

export interface COrMDTO {
  cOrMID : number;
  name   : string;
  pOrCID : number;
  brgy   : BrgyDTO[];
}

export function mapModelToCOrMDTO(cOrM: COrM): COrMDTO {
  return {
    cOrMID : cOrM.cOrMID,
    name   : cOrM.name,
    pOrCID : cOrM.pOrCID,
    brgy   : cOrM.brgy.map(mapModelToBrgyDTO),
  };
}

export interface BrgyDTO {
  brgyID : number;
  name   : string;
  cOrMID : number;
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

export interface AddressDTO {
  regionID : number;
  pOrCID   : number;
  cOrMID   : number;
  brgyID   : number;
  street   : string;
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

export interface M_UpdatePasswordFacilityDTO {
  facilityID      : string;
  currentPassword : string;
  newPassword     : string;
}

// No <Actor>_CreateFacilityDTO because Facilities are created externally.

// TO ADD MORE DTOs AND MAPPING FUNCTIONS

// DAOs

export class FacilityDAO { // call functions under these DAOs sa page.server.ts instead of writing raw commands there.

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

  static async getOutpatientService(facilityID: string, serviceType: serviceType) { // serviceType needs mapping
    
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
