import {
  dateToTimeMapping,
  completionTimeMapping,
  moneyMapping,
  updatedAtMapping,
} from "./mappings";

import {
  availability,
  facilityType,
  load,
  OPServiceTypes,
  ownership,
  provider,
  specializedServiceType,
} from "./projectArrays";

import { AddressDAO } from "./server/dataLayer/AddressDAO";
import { AdminDAO, FacilityAdminListDAO } from "./server/dataLayer/AdminDAO";
import { AmbulanceServiceDAO } from "./server/dataLayer/AmbulanceDAO";
import {
  BloodBankServiceDAO,
  BloodTypeMappingDAO,
} from "./server/dataLayer/BloodBankDAO";
import { ContactDAO } from "./server/dataLayer/ContactDAO";
import { OperatingHoursDAO } from "./server/dataLayer/OperatingHoursDAO";
import {
  DivisionDAO,
  PatientDivisionListDAO,
  FacilityDivisionListDAO,
} from "./server/dataLayer/DivisionDAO";
import { EmployeeDAO } from "./server/dataLayer/EmployeeDAO";
import { ERServiceDAO } from "./server/dataLayer/ERDAO";
import { FacilityDAO } from "./server/dataLayer/FacilityDAO";
import { GeographyDAO } from "./server/dataLayer/GeographyDAO";
import { ICUServiceDAO } from "./server/dataLayer/ICUDAO";
import { OutpatientServiceDAO } from "./server/dataLayer/OutpatientDAO";
import {
  ServicesDAO,
  PatientServiceListDAO,
  FacilityServiceListDAO,
} from "./server/dataLayer/ServicesDAO";
import { UpdateLogDAO } from "./server/dataLayer/UpdateLogDAO";
import { SessionDAO } from "./server/dataLayer/SessionDAO";
import { validateUser } from "./server/auth";

import {
  validateAmbulance,
  validateBloodBank,
  validateER,
  validateICU,
  validateOP,
} from "./server/validateService";

import type {
  RegionDTO,
  POrCDTO,
  COrMDTO,
  BrgyDTO,
  AddressDTO,
  GeneralInformationFacilityDTO,
  UpdateGeneralInformationFacilityDTO,
  DivisionDTO,
  CreateDivisionDTO,
  UpdateDivisionDTO,
  MultiServiceDivisionsDTO,
  AdminDTO,
  CreateAdminDTO,
  UpdateAdminDTO,
  InitialAdminDetailsDTO,
  ServiceDTO,
  CreateAmbulanceServiceDTO,
  AmbulanceServiceDTO,
  UpdateAmbulanceServiceDTO,
  BloodTypeMappingDTO,
  CreateBloodBankServiceDTO,
  BloodBankServiceDTO,
  UpdateBloodBankServiceDTO,
  CreateERServiceDTO,
  ERServiceDTO,
  UpdateERServiceDTO,
  CreateICUServiceDTO,
  ICUServiceDTO,
  UpdateICUServiceDTO,
  CreateOutpatientServiceDTO,
  OutpatientServiceDTO,
  UpdateOutpatientServiceDTO,
  CreateUpdateLogDTO,
  UpdateLogDTO,
  CreateContactDTO,
  ServiceResultsDTO,
  LoadMoreResultsDTO,
  PaginatedResultsDTO,
  FacilityDivisionResultsDTO,
  FacilityServiceResultsDTO,
  AdminPreviewDTO,
} from "./server/dataLayer/DTOs";

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

export const facilityServicePageSize: number = 10;

export const patientSearchPageSize: number = 10;

export const facilityAdminsPageSize: number = 10;

export const facilityUpdateLogsPageSize: number = 10;

export const facilityDivisionsPageSize: number = 10;

export type OPServiceType = (typeof OPServiceTypes)[number];

export type Status1 = 'available' | 'short delay' | 'moderate delay' | 'extended delay' | 'unavailable';

export type Status2 = 'steady' | 'moderate' | 'crowded' | 'near-capacity' | 'full-capacity' | 'closed';

export type {
  RegionDTO,
  POrCDTO,
  COrMDTO,
  BrgyDTO,
  AddressDTO,
  GeneralInformationFacilityDTO,
  UpdateGeneralInformationFacilityDTO,
  DivisionDTO,
  CreateDivisionDTO,
  UpdateDivisionDTO,
  MultiServiceDivisionsDTO,
  AdminDTO,
  CreateAdminDTO,
  UpdateAdminDTO,
  InitialAdminDetailsDTO,
  ServiceDTO,
  CreateAmbulanceServiceDTO,
  AmbulanceServiceDTO,
  UpdateAmbulanceServiceDTO,
  BloodTypeMappingDTO,
  CreateBloodBankServiceDTO,
  BloodBankServiceDTO,
  UpdateBloodBankServiceDTO,
  CreateERServiceDTO,
  ERServiceDTO,
  UpdateERServiceDTO,
  CreateICUServiceDTO,
  ICUServiceDTO,
  UpdateICUServiceDTO,
  CreateOutpatientServiceDTO,
  OutpatientServiceDTO,
  UpdateOutpatientServiceDTO,
  CreateUpdateLogDTO,
  UpdateLogDTO,
  CreateContactDTO,
  ServiceResultsDTO,
  LoadMoreResultsDTO,
  PaginatedResultsDTO,
  FacilityDivisionResultsDTO,
  FacilityServiceResultsDTO,
  AdminPreviewDTO,
};

export {
  // Mappings
  dateToTimeMapping,
  completionTimeMapping,
  moneyMapping,
  updatedAtMapping,

  // Project Arrays
  provider,
  specializedServiceType,
  OPServiceTypes,
  facilityType,
  ownership,
  availability,
  load,
};

// Server
export {
  // DAOs
  FacilityDAO,
  ContactDAO,
  OperatingHoursDAO,
  AddressDAO,
  GeographyDAO,
  EmployeeDAO,
  AdminDAO,
  FacilityAdminListDAO,
  ServicesDAO,
  PatientServiceListDAO,
  FacilityServiceListDAO,
  DivisionDAO,
  PatientDivisionListDAO,
  FacilityDivisionListDAO,
  UpdateLogDAO,
  AmbulanceServiceDAO,
  BloodBankServiceDAO,
  BloodTypeMappingDAO,
  ERServiceDAO,
  ICUServiceDAO,
  OutpatientServiceDAO,
  SessionDAO,

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
  validateAmbulance,
  validateBloodBank,
  validateER,
  validateICU,
  validateOP,
  validateUser,
};
