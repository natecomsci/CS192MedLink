import { PrismaClient } from '@prisma/client'

import { Provider, SecurityQuestion, FacilityType, Ownership, Availability, Load, ServiceType } from '@prisma/client'

import type { Region, POrC, COrM, Brgy, Address } from '@prisma/client';

// DTOs

// Naming Convention: (First Letter of Actor(s) Separated by _)_(View | Create | Update | <Insert Other Action>)<Model Name>DTO
// On the first part: e.g. F corresponds to "Facility" - both Managers and Admins

export interface RegionDTO {
  regionID : number;
  name     : string;
}

export interface POrCDTO {
  pOrCID   : number;
  name     : string;
  regionID : number;
}

export interface COrMDTO {
  cOrMID : number;
  name   : string;
  pOrCID : number;
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

// Create and Update DTOs assume that a Facility has no Divisions.

export interface CreateAmbulanceServiceDTO {
  phoneNumber       : string;
  openingTime       : string; // format: hh:mm:ss
  closingTime       : string; // format: hh:mm:ss
  baseRate          : number;
  minCoverageRadius : number;
  mileageRate       : number;
  maxCoverageRadius : number;
}

export interface CreateBloodBankServiceDTO {
  phoneNumber     : string;
  openingTime     : string; // format: hh:mm:ss
  closingTime     : string; // format: hh:mm:ss
  pricePerUnit    : number;
  turnaroundTimeD : number;
  turnaroundTimeH : number;
}

export interface CreateERServiceDTO {
  phoneNumber : string;
}

export interface CreateICUServiceDTO {
  phoneNumber : string;
  baseRate    : number;
}

export interface CreateOutpatientServiceDTO {
  serviceType     : ServiceType;
  price           : number;
  completionTimeD : number;
  completionTimeH : number;
  acceptsWalkIns  : boolean;
}

export interface M_UpdateGenInfoFacilityDTO {
  name              : string;
  photo             : string;       // hardcode for now sa business logic
  address           : AddressDTO;
  phoneNumber       : string;
  facilityType      : FacilityType;
  ownership         : Ownership;
  bookingSystem     : string;
  acceptedProviders : string;
}

export interface M_UpdatePasswordFacilityDTO {
  currentPassword : string;
  newPassword     : string;
}