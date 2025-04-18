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
import { AdminDAO, FacilityAdminListDAO } from "./server/AdminDAO";
import { AmbulanceServiceDAO } from "./server/AmbulanceDAO";
import { BloodBankServiceDAO, BloodTypeMappingDAO } from "./server/BloodBankDAO";
import { EmployeeDAO } from "./server/EmployeeDAO";
import { ERServiceDAO } from "./server/ERDAO";
import { FacilityDAO } from "./server/FacilityDAO";
import { ICUServiceDAO } from "./server/ICUDAO";
import { OutpatientServiceDAO } from "./server/OutpatientDAO";
import { ServicesDAO, PatientServiceListDAO, FacilityServiceListDAO } from "./server/ServicesDAO";
import { UpdateLogDAO } from "./server/UpdateLogDAO";
import { DivisionDAO, FacilityDivisionListDAO } from "./server/DivisionDAO";
import { GeographyDAO } from "./server/GeographyDAO";

import type { 
        ServiceDTO,
        ServiceResultsDTO,
        LoadMoreResultsDTO,
        
        // FacilityResultsDTO,
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

        Create_UpdateDivisionDTO,
        UpdateOutpatientServiceDTO,
        DivisionDTO,
        MultiServiceDivisionsDTO,

        PaginatedResultsDTO,
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
export const facilityServicePageSize: number = 10
export const patientSearchPageSize: number = 10

export const facilityAdminsPageSize: number = 10

export const facilityUpdateLogsPageSize: number = 10

export const facilityDivisionsPageSize: number = 10

export type OPServiceType = typeof OPServiceTypes[number];

export type {
  // DTOs
  ServiceDTO,
  ServiceResultsDTO,
  LoadMoreResultsDTO,

  // FacilityResultsDTO,
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

  Create_UpdateDivisionDTO,
  UpdateOutpatientServiceDTO,
  DivisionDTO,
  MultiServiceDivisionsDTO,

  PaginatedResultsDTO
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
  AdminDAO, FacilityAdminListDAO,
  EmployeeDAO,
  FacilityDAO,
  ServicesDAO, PatientServiceListDAO, FacilityServiceListDAO,
  UpdateLogDAO,
  DivisionDAO, FacilityDivisionListDAO,
  GeographyDAO,
  
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