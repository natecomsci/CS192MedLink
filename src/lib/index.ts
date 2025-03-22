import { serviceNameToNameMapping, dateToTimeMapping } from "./Mappings"
import { 
        availability, 
        facilityType, 
        load, 
        OPServiceTypes, 
        ownership, 
        providers, 
        specializedServiceType 
      } from "./projectArrays"

import { AddressDAO } from "./server/AddressDAO";
import { AdminDAO } from "./server/AdminDAO";
import { AmbulanceServiceDAO } from "./server/AmbulanceDAO";
import { BloodBankServiceDAO, BloodTypeMappingDAO } from "./server/BloodBankDAO";
import { EmployeeDAO } from "./server/EmployeeDAO";
import { ERServiceDAO } from "./server/ERDAO";
import { FacilityDAO } from "./server/FacilityDAO";
import { ICUServiceDAO } from "./server/ICUDAO";
import { OutpatientServiceDAO } from "./server/OutpatientDAO";
import { ServicesDAO } from "./server/ServicesDAO";
import { UpdateLogDAO } from "./server/UpdateLogDAO";

import type { 
        ServiceDTO,
        PaginatedServiceDTO,
        
        FacilityDTO,
        GeneralInformationFacilityDTO,

        RegionDTO,
        POrCDTO,
        COrMDTO,
        BrgyDTO,
        AddressDTO,

        CreateAmbulanceServiceDTO,
        AmbulanceServiceDTO,

        BloodTypeMappingDTO,
        CreateBloodBankServiceDTO,
        BloodBankServiceDTO,

        CreateERServiceDTO,
        ERServiceDTO,

        CreateICUServiceDTO,
        ICUServiceDTO,

        CreateOutpatientServiceDTO,
        OutpatientServiceDTO,

        InitialAdminDetailsDTO,
        AdminDTO,
        PaginatedAdminDTO,
      } from "./server/DTOs";

import { 
        validateFloat,
        validateInteger,
        validatePersonName,
        validateFacilityName,
        validatePhone,
        validateEmail,
        validateOperatingHours,
        validateCoverageRadius,
        validateCompletionTime,
        validateStreet,
        validateLink,
        validateImage,
      } from "./server/formValidators";

// Global Project Variables
export const facilityServicePageSize: number = 5
export const patientSearchPageSize: number = 5

export const facilityAdminsPageSize: number = 5

export const facilityUpdateLogsPageSize: number = 5

export type OPServiceType = typeof OPServiceTypes[number];

export type {
  // DTOs
  ServiceDTO,
  PaginatedServiceDTO,

  FacilityDTO,
  GeneralInformationFacilityDTO,

  RegionDTO,
  POrCDTO,
  COrMDTO,
  BrgyDTO,
  AddressDTO,

  CreateAmbulanceServiceDTO,
  AmbulanceServiceDTO,

  BloodTypeMappingDTO,
  CreateBloodBankServiceDTO,
  BloodBankServiceDTO,

  CreateERServiceDTO,
  ERServiceDTO,

  CreateICUServiceDTO,
  ICUServiceDTO,

  CreateOutpatientServiceDTO,
  OutpatientServiceDTO,

  InitialAdminDetailsDTO,
  AdminDTO,
  PaginatedAdminDTO,
}

export {
  // Mappings
  serviceNameToNameMapping,
  dateToTimeMapping,

  // Project Arrays
  providers,
  specializedServiceType,
  OPServiceTypes,
  facilityType,
  ownership,
  availability,
  load,

  // DAOs
  AddressDAO,
  AdminDAO,
  EmployeeDAO,
  FacilityDAO,
  ServicesDAO,
  UpdateLogDAO,
  
  AmbulanceServiceDAO,
  BloodBankServiceDAO, BloodTypeMappingDAO,
  ERServiceDAO,
  ICUServiceDAO,
  OutpatientServiceDAO,

  // Form Validators
  validateFloat,
  validateInteger,
  validatePersonName,
  validateFacilityName,
  validatePhone,
  validateEmail,
  validateOperatingHours,
  validateCoverageRadius,
  validateCompletionTime,
  validateStreet,
  validateLink,
  validateImage,

}