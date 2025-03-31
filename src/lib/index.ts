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
import { DivisionDAO } from "./server/DivisionDAO";

import type { 
        ServiceDTO,
        PaginatedServiceDTO,
        
        FacilityResultsDTO,
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
        Create_UpdateAdminDTO,
        AdminDTO,
        PaginatedAdminDTO,

        Create_UpdateDivisionDTO,
        DivisionDTO,
        MultiServiceDivisionsDTO,
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

import {
        adminPagingHandler
} from "./postHandlers"

// Global Project Variables
export const facilityServicePageSize: number = 5
export const patientSearchPageSize: number = 5

export const facilityAdminsPageSize: number = 5

export const facilityUpdateLogsPageSize: number = 5

export const facilityDivisionsPageSize: number = 5

export type OPServiceType = typeof OPServiceTypes[number];

export type {
  // DTOs
  ServiceDTO,
  PaginatedServiceDTO,

  FacilityResultsDTO,
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
  Create_UpdateAdminDTO,
  AdminDTO,
  PaginatedAdminDTO,

  Create_UpdateDivisionDTO,
  DivisionDTO,
  MultiServiceDivisionsDTO,
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
}

// Server
export {
  // DAOs
  AddressDAO,
  AdminDAO,
  EmployeeDAO,
  FacilityDAO,
  ServicesDAO,
  UpdateLogDAO,
  DivisionDAO,
  
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

  adminPagingHandler,

}