import { PrismaClient, Provider, SecurityQuestion, FacilityType, Ownership, Availability, Load, ServiceType } from '@prisma/client'

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

export interface POrCDTO {
  pOrCID   : number;
  name     : string;
  regionID : number;
  brgy     : COrMDTO[];
}

export interface COrMDTO {
  cOrMID : number;
  name   : string;
  pOrCID : number;
  brgy   : BrgyDTO[];
}

export interface BrgyDTO {
  brgyID : number;
  name   : string;
  cOrMID : number;
}

export interface AddressDTO {
  regionID : number;
  pOrCID   : number;
  cOrMID   : number;
  brgyID   : number;
  street   : string;
}

// The above DTOs have an atypical naming convention kasi yan lang naman talaga kailangang data dyan in any scenario.

export interface P_M_ViewFacilityDTO {
  facilityID        : string;
  name              : string;
  photo             : string;
  address           : AddressDTO;
  email             : string;
  phoneNumber       : string;
  facilityType      : FacilityType;
  ownership         : Ownership;
  LTO               : string;
  COA               : string;
  bookingSystem?    : string;
  acceptedProviders : Provider[];
  ambulanceService? : P_M_ViewAmbulanceServiceDTO;
  bloodBankService? : P_M_ViewBloodBankServiceDTO;
  erService?        : P_M_ViewERServiceDTO;
  icuService?       : P_M_ViewICUServiceDTO;
  outpatientService : P_M_ViewOutpatientServiceDTO[];
  divisions         : P_M_ViewDivisionDTO[];
}

// ^ to change

export interface M_UpdateGeneralInfoFacilityDTO {
  facilityID         : string;
  name               : string;
  photo              : string;
  address            : AddressDTO;
  email              : string;
  phoneNumber        : string;
  facilityType       : FacilityType;
  ownership          : Ownership;
  LTO                : string;
  COA                : string;
  bookingSystem?     : string;
  acceptedProviders  : Provider[];
}

// Illustration of functionality ng DTOs : An intermediary between DAOs and the database containing only necessary information for specific scenarios.

export interface M_UpdatePasswordFacilityDTO {
  facilityID      : string;
  currentPassword : string;
  newPassword     : string;
}

// No <Actor>_CreateFacilityDTO because Facilities are created externally.

// DAOs

export class FacilityDAO { // call functions under these DAOs sa page.server.ts instead of writing raw commands there.

  static async updateFacilityGeneralInfo(data: M_UpdateGeneralInfoFacilityDTO) {
    try {
      const facilityToUpdate = await prisma.facility.update({
        where: {
          facilityID: data.facilityID,
        },
      
        data: {
          name              : data.name,

          // to insert updating photo and address

          email             : data.email,
          phoneNumber       : data.phoneNumber,
          facilityType      : data.facilityType,
          ownership         : data.ownership,
          LTO               : data.LTO,
          COA               : data.COA,
          bookingSystem     : data.bookingSystem,
          acceptedProviders : data.acceptedProviders,
        },
      });

      return facilityToUpdate;
    } catch (error) {
      throw new Error("Could not update general facility information.");
    }
  }

  static async deleteFacility(facilityID: string) { // no this function has associated use case. sample lang to.
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

export async function getAmbulanceService(id: string) {
  const ambulanceService = await prisma.ambulanceService.findUnique({
    where: { facilityID: id },
    select: {
      phoneNumber: true,
      openingTime: true,
      closingTime: true,
      baseRate: true,
      minCoverageRadius: true,
      mileageRate: true,
      maxCoverageRadius: true,
      availability: true,
    }
  });
}