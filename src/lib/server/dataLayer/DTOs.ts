import { Provider, 
         FacilityType,
         Ownership, 
         Availability, 
         Load,
         Role,
         Action, 
         ContactType
} from '@prisma/client';

// DTOs

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
  email?            : ContactDTO[],
  phoneNumber       : ContactDTO[],
  openingTime?      : Date,
  closingTime?      : Date,
  facilityType      : FacilityType,
  ownership         : Ownership,
  bookingSystem?    : string,
  acceptedProviders : Provider[],
}

export type UpdateGeneralInformationFacilityDTO = Partial<GeneralInformationFacilityDTO>;

export interface DivisionDTO {
  divisionID : string,
  name       : string,
  createdAt  : Date,
  updatedAt  : Date,
}

export interface CreateDivisionDTO {
  name        : string,
  email?      : string[],
  phoneNumber : string[],
  openingTime : Date,
  closingTime : Date,
}

export type UpdateDivisionDTO = Omit<Partial<CreateDivisionDTO>, ("email" | "phoneNumber")> & {
  email?       : ContactDTO[],
  phoneNumber? : ContactDTO[],
};

export interface MultiServiceDivisionsDTO {
  divisionID : string,
  name       : string,
  services   : {
    serviceID : string, 
    type      : string,
  }[],
}

export interface AdminDTO {
  employeeID : string,
  fname      : string,
  mname?     : string,
  lname      : string,
  divisions? : {
    divisionID : string,
    name       : string,
  }[],
  createdAt  : Date,
  updatedAt  : Date,
}

export interface Create_UpdateAdminDTO {
  fname        : string,
  mname?       : string,
  lname        : string,
  divisionIDs? : string[],
}

export interface InitialAdminDetailsDTO {
  adminID  : string,
  fname    : string,
  mname?   : string,
  lname    : string,
  password : string,
}

export interface ServiceDTO {
  serviceID : string,
  type      : string,
  division? : {
    divisionID : string,
    name       : string,
  },
  createdAt : Date,
  updatedAt : Date,
}

export interface CreateAmbulanceServiceDTO {
  phoneNumber?      : string[],
  openingTime?      : Date,
  closingTime?      : Date,
  baseRate          : number,
  minCoverageRadius : number,
  mileageRate       : number,
  maxCoverageRadius : number,
  note?             : string,
  divisionID?       : string,
}

export interface AmbulanceServiceDTO {
  phoneNumber?      : ContactDTO[],
  openingTime?      : Date,
  closingTime?      : Date,
  availability      : Availability,
  baseRate          : number,
  minCoverageRadius : number,
  mileageRate       : number,
  maxCoverageRadius : number,
  note?             : string,
  division? : {
    divisionID : string,
    name       : string,
  },
  updatedAt : Date,
}

export type UpdateAmbulanceServiceDTO = Partial<
  Omit<AmbulanceServiceDTO, "division"> & {
    divisionID?: string;
  }
>;

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
  phoneNumber?     : string[],
  openingTime?     : Date,
  closingTime?     : Date,
  basePricePerUnit : number,
  turnaroundTimeD  : number,
  turnaroundTimeH  : number,
  note?            : string,
  divisionID?      : string,
}

export interface BloodBankServiceDTO {
  phoneNumber?          : ContactDTO[],
  openingTime?          : Date,
  closingTime?          : Date,
  basePricePerUnit      : number,
  turnaroundTimeD       : number,
  turnaroundTimeH       : number,
  bloodTypeAvailability : BloodTypeMappingDTO,
  note?                 : string,
  division? : {
    divisionID : string,
    name       : string,
  },
  updatedAt? : Date,
}

export type UpdateBloodBankServiceDTO = Partial<
  Omit<BloodBankServiceDTO, "division"> & {
    divisionID?: string;
  }
>;

export interface CreateERServiceDTO {
  phoneNumber? : string[],
  openingTime? : Date,
  closingTime? : Date,
  note?        : string,
  divisionID?  : string,
}

export interface ERServiceDTO {
  phoneNumber?         : ContactDTO[],
  openingTime?         : Date,
  closingTime?         : Date,
  load                 : Load,
  availableBeds        : number,
  nonUrgentPatients    : number,
  nonUrgentQueueLength : number,
  urgentPatients       : number,
  urgentQueueLength    : number,
  criticalPatients     : number,
  criticalQueueLength  : number,
  note?                : string,
  division? : {
    divisionID : string,
    name       : string,
  },
  updatedAt? : Date,
}

export type UpdateERServiceDTO = Partial<
  Omit<ERServiceDTO, "division"> & {
    divisionID?: string;
  }
>;

export interface CreateICUServiceDTO {
  phoneNumber? : string[],
  openingTime? : Date,
  closingTime? : Date,
  baseRate     : number,
  note?        : string,
  divisionID?  : string,
}

export interface ICUServiceDTO {
  phoneNumber?        : ContactDTO[],
  openingTime?        : Date,
  closingTime?        : Date,
  load                : Load,
  baseRate            : number,
  availableBeds       : number,
  cardiacSupport      : boolean,
  neurologicalSupport : boolean,
  renalSupport        : boolean,
  respiratorySupport  : boolean,
  note?               : string,
  division? : {
    divisionID : string,
    name       : string,
  },
  updatedAt? : Date,
}

export type UpdateICUServiceDTO = Partial<
  Omit<ICUServiceDTO, "division"> & {
    divisionID?: string;
  }
>;

export interface CreateOutpatientServiceDTO {
  type            : string,
  basePrice       : number,
  completionTimeD : number,
  completionTimeH : number,
  acceptsWalkIns  : boolean,
  note?           : string,
  divisionID?     : string,
}

export interface OutpatientServiceDTO {
  type            : string,
  basePrice       : number,
  completionTimeD : number,
  completionTimeH : number,
  isAvailable     : boolean,
  acceptsWalkIns  : boolean,
  note?           : string,
  division? : {
    divisionID : string,
    name       : string,
  },
  updatedAt? : Date,
}

export type UpdateOutpatientServiceDTO = Partial<
  Omit<OutpatientServiceDTO, ("division" | "type")> & {
    divisionID?: string;
  }
>;

export interface CreateUpdateLogDTO {
  entity      : string,
  action      : Action,
  divisionID? : string,
}

export interface UpdateLogDTO {
  entity    : string,
  action    : Action,
  employee  : {
    employeeID : string,
    fname      : string,
    mname?     : string,
    lname      : string,
    role       : Role
  },
  createdAt : Date,
}

export interface CreateContactDTO {
  info        : string;
  type        : ContactType;
  facilityID? : string;
  divisionID? : string;
  serviceID?  : string;
}

export interface ContactDTO {
  contactID : string,
  info      : string;
}

export interface ServiceResultsDTO {
  facilityID : string,
  name       : string,
  serviceID  : string,
  type       : string,
}

export interface LoadMoreResultsDTO<T> {
  results : T[],
  hasMore : boolean,
}

export interface PaginatedResultsDTO<T> {
  results     : T[],
  totalPages  : number,
  currentPage : number,
}

export interface FacilityDivisionResultsDTO {
  divisionID : string,
  name       : string,
}

export interface FacilityServiceResultsDTO {
  serviceID : string,
  type      : string,
}

export interface AdminPreviewDTO {
  photo  : string,
  fname  : string,
  mname? : string,
  lname  : string,
}