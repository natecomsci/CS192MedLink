import { Provider, 
         FacilityType,
         Ownership, 
         Availability, 
         Load 
       } from '@prisma/client';

import {
        type OPServiceType
} from '../projectArrays'

// DTOs

// Naming Convention: (First Letter of Actor(s) Separated by _)_(View | Create | Update | <Insert Other Action>)<Model Name>DTO
// On the first part: e.g. F corresponds to "Facility" - both Managers and Admins

// Create and Update Service DTOs assume that a Facility has no Divisions.

export interface ServiceDTO {
  serviceID  : string;
  type       : OPServiceType;
  createdAt  : Date;
  updatedAt  : Date;
}

export interface CreateAmbulanceServiceDTO {
  phoneNumber       : string,
  openingTime       : Date,
  closingTime       : Date,
  baseRate          : number,
  minCoverageRadius : number,
  mileageRate       : number,
  maxCoverageRadius : number,
}

export interface AmbulanceServiceDTO {
  phoneNumber        : string,
  openingTime        : Date,
  closingTime        : Date,
  baseRate           : number,
  minCoverageRadius  : number,
  mileageRate        : number,
  maxCoverageRadius  : number,
  availability       : Availability,
  updatedAt?         : Date,
}

export interface BloodTypeMappingDTO {
  A_P   : boolean,
  A_N   : boolean,
  B_P   : boolean,
  B_N   : boolean,
  O_P   : boolean,
  O_N   : boolean,
  AB_P  : boolean,
  AB_N  : boolean,
}

export interface CreateBloodBankServiceDTO {
  phoneNumber     : string,
  openingTime     : Date,
  closingTime     : Date,
  pricePerUnit    : number,
  turnaroundTimeD : number,
  turnaroundTimeH : number,
}

export interface BloodBankServiceDTO {
  phoneNumber            : string,
  openingTime            : Date,
  closingTime            : Date,
  pricePerUnit           : number,
  turnaroundTimeD        : number,
  turnaroundTimeH        : number,
  bloodTypeAvailability  : BloodTypeMappingDTO,
  updatedAt?             : Date,
}

export interface CreateERServiceDTO {
  phoneNumber : string,
}

export interface ERServiceDTO {
  phoneNumber           : string,
  load                  : Load,
  availableBeds         : number,
  nonUrgentPatients     : number,
  nonUrgentQueueLength  : number,
  urgentPatients        : number,
  urgentQueueLength     : number,
  criticalPatients      : number,
  criticalQueueLength   : number,
  updatedAt?            : Date,
}

export interface CreateICUServiceDTO {
  phoneNumber : string,
  baseRate    : number,
}

export interface ICUServiceDTO {
  phoneNumber          : string,
  baseRate             : number,
  load                 : Load,
  availableBeds        : number,
  cardiacSupport       : boolean,
  neurologicalSupport  : boolean,
  renalSupport         : boolean,
  respiratorySupport   : boolean,
  updatedAt?           : Date,
}

export interface CreateOutpatientServiceDTO {
  serviceType     : string,
  price           : number,
  completionTimeD : number,
  completionTimeH : number,
  acceptsWalkIns  : boolean,
}

export interface OutpatientServiceDTO {
  price            : number,
  completionTimeD  : number,
  completionTimeH  : number,
  isAvailable      : boolean,
  acceptsWalkIns   : boolean,
  updatedAt?       : Date,
}

export interface RegionDTO {
  regionID : number,
  name     : string,
}

export interface POrCDTO {
  pOrCID   : number,
  name     : string,
  regionID : number,
}

export interface COrMDTO {
  cOrMID : number,
  name   : string,
  pOrCID : number,
}

export interface BrgyDTO {
  brgyID : number,
  name   : string,
  cOrMID : number,
}

export interface AddressDTO {
  regionID : number,
  pOrCID   : number,
  cOrMID   : number,
  brgyID   : number,
  street   : string,
}

export interface FacilityDTO {
  facilityID : string;
  name       : string,
}

export interface GeneralInformationFacilityDTO {
  name               : string,
  photo              : string,
  address            : AddressDTO,
  email              : string,
  phoneNumber        : string,
  facilityType       : FacilityType,
  ownership          : Ownership,
  bookingSystem?     : string,
  acceptedProviders  : Provider[],
}

export interface CreateAdminDTO {
  fname    : string,
  mname?   : string,
  lname    : string,
  password : string,
}

export interface InitialAdminDetailsDTO {
  adminID  : string,
  fname    : string,
  mname?   : string,
  lname    : string,
  password : string,
}

export interface PaginatedServiceDTO {
  services: ServiceDTO[],
  totalPages: number,
  currentPage: number,
}