import { Provider, 
  FacilityType,
  Ownership, 
  Availability, 
  Load,
  Action 
} from '@prisma/client';

// DTOs

// TO DO: ADD ? ON UPDATE DTOs

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

export interface GeneralInformationFacilityDTO {
  name              : string,
  photo             : string,
  address           : AddressDTO,
  email             : string,
  phoneNumber       : string,
  facilityType      : FacilityType,
  ownership         : Ownership,
  bookingSystem?    : string,
  acceptedProviders : Provider[],
}

export interface DivisionDTO {
  divisionID : string,
  name       : string,
  createdAt  : Date,
  updatedAt  : Date,
}

export interface Create_UpdateDivisionDTO {
  name        : string,
  phoneNumber : string,
  openingTime : Date,
  closingTime : Date,
}

export interface LinkableServiceDTO {
  serviceID   : string,
  type        : string,
}

export interface AdminDTO {
  employeeID : string;
  fname      : string,
  mname?     : string,
  lname      : string,
  divisions? : string[],
  createdAt  : Date;
  updatedAt  : Date;
}

export interface Create_UpdateAdminDTO {
  fname      : string,
  mname?     : string,
  lname      : string,
  divisions? : string[],
}

export interface InitialAdminDetailsDTO {
  adminID  : string,
  fname    : string,
  mname?   : string,
  lname    : string,
  password : string,
}

export interface ServiceDTO {
  serviceID   : string,
  type        : string,
  divisionID? : string,
  createdAt   : Date,
  updatedAt   : Date,
}

export interface CreateAmbulanceServiceDTO {
  phoneNumber       : string,
  openingTime       : Date,
  closingTime       : Date,
  baseRate          : number,
  minCoverageRadius : number,
  mileageRate       : number,
  maxCoverageRadius : number,
  divisionID?       : string,
}

export interface AmbulanceServiceDTO {
  phoneNumber       : string,
  openingTime       : Date,
  closingTime       : Date,
  baseRate          : number,
  minCoverageRadius : number,
  mileageRate       : number,
  maxCoverageRadius : number,
  availability      : Availability,
  divisionID?       : string,
  updatedAt?        : Date,
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
  divisionID?     : string,
}

export interface BloodBankServiceDTO {
  phoneNumber           : string,
  openingTime           : Date,
  closingTime           : Date,
  pricePerUnit          : number,
  turnaroundTimeD       : number,
  turnaroundTimeH       : number,
  bloodTypeAvailability : BloodTypeMappingDTO,
  divisionID?           : string,
  updatedAt?            : Date,
}

export interface CreateERServiceDTO {
  phoneNumber : string,
  divisionID? : string,
}

export interface ERServiceDTO {
  phoneNumber          : string,
  load                 : Load,
  availableBeds        : number,
  nonUrgentPatients    : number,
  nonUrgentQueueLength : number,
  urgentPatients       : number,
  urgentQueueLength    : number,
  criticalPatients     : number,
  criticalQueueLength  : number,
  divisionID?          : string,
  updatedAt?           : Date,
}

export interface CreateICUServiceDTO {
  phoneNumber : string,
  baseRate    : number,
  divisionID? : string,
}

export interface ICUServiceDTO {
  phoneNumber         : string,
  baseRate            : number,
  load                : Load,
  availableBeds       : number,
  cardiacSupport      : boolean,
  neurologicalSupport : boolean,
  renalSupport        : boolean,
  respiratorySupport  : boolean,
  divisionID?         : string,
  updatedAt?          : Date,
}

export interface CreateOutpatientServiceDTO {
  serviceType     : string,
  price           : number,
  completionTimeD : number,
  completionTimeH : number,
  acceptsWalkIns  : boolean,
  divisionID?     : string,
}

export interface OutpatientServiceDTO {
  price           : number,
  completionTimeD : number,
  completionTimeH : number,
  isAvailable     : boolean,
  acceptsWalkIns  : boolean,
  divisionID?     : string,
  updatedAt?      : Date,
}

export interface CreateUpdateLogDTO {
  entity     : string,
  action     : Action,
}

export interface UpdateLogDTO {
  entity     : string,
  action     : Action,
  employeeID : String,
  createdAt  : Date,
}

export interface ServiceResultsDTO {
  facilityID : string;
  name       : string,
  serviceID  : string;
  type       : string,
}

export interface FacilityResultsDTO {
  facilityID : string;
  name       : string,
}

export interface PaginatedServiceDTO {
  services    : ServiceDTO[],
  totalPages  : number,
  currentPage : number,
}

export interface PatientServiceSearchDTO {
  facilityID : string;
  name       : string,
  services   : string[], 
}

export interface PaginatedAdminDTO {
  admins      : AdminDTO[],
  totalPages  : number,
  currentPage : number,
}

export interface PaginatedUpdateLogDTO {
  updateLogs  : UpdateLogDTO[],
  totalPages  : number,
  currentPage : number,
}

export interface PaginatedDivisionDTO {
  divisions   : DivisionDTO[],
  totalPages  : number,
  currentPage : number,
}
