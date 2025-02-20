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

// Illustration of functionality ng DTOs : An intermediary between DAOs and the database containing only necessary information for specific scenarios.

export interface M_UpdatePasswordFacilityDTO {
  facilityID      : string;
  currentPassword : string;
  newPassword     : string;
}

// INSERT DTOs

export interface AmbulanceData {
  phoneNumber:        string;
  openingTime:        string;
  closingTime:        string;
  baseRate:           number;
  minCoverageRadius:  number;
  mileageRate:        number;
  maxCoverageRadius:  number;
  availability:       boolean;
};

interface BloodtypeData {
  A_P:  boolean;
  A_N:  boolean;
  B_P:  boolean;
  B_N:  boolean;
  O_P:  boolean;
  O_N:  boolean;
  AB_P: boolean;
  AB_N: boolean;
}

export interface BloodData {
  phoneNumber:            string;
  openingTime:            string;
  closingTime:            string;
  pricePerUnit:           number;
  turnaroundTimeD:        number;
  turnaroundTimeH:        number;
  bloodTypeAvailability:  BloodtypeData;
};


export interface ERData {
  phoneNumber:          string;
  load:                 string;
  availableBeds:        number;
  nonUrgentPatients:    number;
  nonUrgentQueueLength: number;
  urgentPatients:       number;
  urgentQueueLength:    number;
  criticalPatients:     number;
  criticalQueueLength:  number;
};


export interface ICUData {
  phoneNumber:          string;
  baseRate:             number;
  load:                 string;
  availableBeds:        number;
  cardiacSupport:       boolean;
  neurologicalSupport:  boolean;
  renalSupport:         boolean;
  respiratorySupport:   boolean;
};

export interface OPData {
  price:                number;
  completionTimeD:      number;
  completionTimeH:      number;
  isAvailable:          boolean;
  acceptsWalkIns:       boolean;
};

