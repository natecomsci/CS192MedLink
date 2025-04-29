
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.RegionScalarFieldEnum = {
  regionID: 'regionID',
  name: 'name',
  id: 'id'
};

exports.Prisma.POrCScalarFieldEnum = {
  pOrCID: 'pOrCID',
  name: 'name',
  id: 'id',
  regionID: 'regionID'
};

exports.Prisma.COrMScalarFieldEnum = {
  cOrMID: 'cOrMID',
  name: 'name',
  id: 'id',
  pOrCID: 'pOrCID'
};

exports.Prisma.BrgyScalarFieldEnum = {
  brgyID: 'brgyID',
  name: 'name',
  id: 'id',
  cOrMID: 'cOrMID'
};

exports.Prisma.AddressScalarFieldEnum = {
  regionID: 'regionID',
  pOrCID: 'pOrCID',
  cOrMID: 'cOrMID',
  brgyID: 'brgyID',
  street: 'street',
  facilityID: 'facilityID'
};

exports.Prisma.FacilityScalarFieldEnum = {
  facilityID: 'facilityID',
  name: 'name',
  photo: 'photo',
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  facilityType: 'facilityType',
  ownership: 'ownership',
  bookingSystem: 'bookingSystem',
  acceptedProviders: 'acceptedProviders',
  updatedAt: 'updatedAt'
};

exports.Prisma.DivisionScalarFieldEnum = {
  divisionID: 'divisionID',
  name: 'name',
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  facilityID: 'facilityID'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  employeeID: 'employeeID',
  password: 'password',
  role: 'role',
  fname: 'fname',
  mname: 'mname',
  lname: 'lname',
  photo: 'photo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  facilityID: 'facilityID'
};

exports.Prisma.SessionScalarFieldEnum = {
  sessionID: 'sessionID',
  expiresAt: 'expiresAt',
  employeeID: 'employeeID'
};

exports.Prisma.ServiceScalarFieldEnum = {
  serviceID: 'serviceID',
  type: 'type',
  keywords: 'keywords',
  note: 'note',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  facilityID: 'facilityID',
  divisionID: 'divisionID'
};

exports.Prisma.AmbulanceServiceScalarFieldEnum = {
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  availability: 'availability',
  baseRate: 'baseRate',
  minCoverageRadius: 'minCoverageRadius',
  mileageRate: 'mileageRate',
  maxCoverageRadius: 'maxCoverageRadius',
  serviceID: 'serviceID'
};

exports.Prisma.BloodTypeMappingScalarFieldEnum = {
  A_P: 'A_P',
  A_N: 'A_N',
  B_P: 'B_P',
  B_N: 'B_N',
  O_P: 'O_P',
  O_N: 'O_N',
  AB_P: 'AB_P',
  AB_N: 'AB_N',
  serviceID: 'serviceID'
};

exports.Prisma.BloodBankServiceScalarFieldEnum = {
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  basePricePerUnit: 'basePricePerUnit',
  turnaroundTimeD: 'turnaroundTimeD',
  turnaroundTimeH: 'turnaroundTimeH',
  serviceID: 'serviceID'
};

exports.Prisma.ERServiceScalarFieldEnum = {
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  load: 'load',
  availableBeds: 'availableBeds',
  nonUrgentPatients: 'nonUrgentPatients',
  nonUrgentQueueLength: 'nonUrgentQueueLength',
  urgentPatients: 'urgentPatients',
  urgentQueueLength: 'urgentQueueLength',
  criticalPatients: 'criticalPatients',
  criticalQueueLength: 'criticalQueueLength',
  serviceID: 'serviceID'
};

exports.Prisma.ICUServiceScalarFieldEnum = {
  openingTime: 'openingTime',
  closingTime: 'closingTime',
  load: 'load',
  baseRate: 'baseRate',
  availableBeds: 'availableBeds',
  cardiacSupport: 'cardiacSupport',
  neurologicalSupport: 'neurologicalSupport',
  renalSupport: 'renalSupport',
  respiratorySupport: 'respiratorySupport',
  serviceID: 'serviceID'
};

exports.Prisma.OutpatientServiceScalarFieldEnum = {
  basePrice: 'basePrice',
  completionTimeD: 'completionTimeD',
  completionTimeH: 'completionTimeH',
  isAvailable: 'isAvailable',
  acceptsWalkIns: 'acceptsWalkIns',
  serviceID: 'serviceID'
};

exports.Prisma.ContactScalarFieldEnum = {
  contactID: 'contactID',
  info: 'info',
  type: 'type',
  facilityID: 'facilityID',
  divisionID: 'divisionID',
  serviceID: 'serviceID'
};

exports.Prisma.UpdateLogScalarFieldEnum = {
  updateLogID: 'updateLogID',
  entity: 'entity',
  action: 'action',
  createdAt: 'createdAt',
  facilityID: 'facilityID',
  divisionID: 'divisionID',
  employeeID: 'employeeID'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.FacilityType = exports.$Enums.FacilityType = {
  BARANGAY_HEALTH_CENTER: 'BARANGAY_HEALTH_CENTER',
  CLINIC: 'CLINIC',
  HEALTH_CENTER: 'HEALTH_CENTER',
  HOSPITAL: 'HOSPITAL',
  INFIRMARY: 'INFIRMARY',
  POLYCLINIC: 'POLYCLINIC',
  PRIMARY_CARE_CLINIC: 'PRIMARY_CARE_CLINIC',
  ALLERGY_CLINIC: 'ALLERGY_CLINIC',
  CARDIOLOGY_CLINIC: 'CARDIOLOGY_CLINIC',
  DENTAL_CLINIC: 'DENTAL_CLINIC',
  DERMATOLOGY_CLINIC: 'DERMATOLOGY_CLINIC',
  ENDOCRINOLOGY_CLINIC: 'ENDOCRINOLOGY_CLINIC',
  ENT_CLINIC: 'ENT_CLINIC',
  FERTILITY_CLINIC: 'FERTILITY_CLINIC',
  GASTROENTEROLOGY_CLINIC: 'GASTROENTEROLOGY_CLINIC',
  IMMUNOLOGY_CLINIC: 'IMMUNOLOGY_CLINIC',
  INFECTIOUS_DISEASE_CLINIC: 'INFECTIOUS_DISEASE_CLINIC',
  MATERNITY_CLINIC: 'MATERNITY_CLINIC',
  NEPHROLOGY_CLINIC: 'NEPHROLOGY_CLINIC',
  NEUROLOGY_CLINIC: 'NEUROLOGY_CLINIC',
  ONCOLOGY_CLINIC: 'ONCOLOGY_CLINIC',
  OPHTHALMOLOGY_CLINIC: 'OPHTHALMOLOGY_CLINIC',
  ORTHOPEDIC_CLINIC: 'ORTHOPEDIC_CLINIC',
  PEDIATRIC_CLINIC: 'PEDIATRIC_CLINIC',
  PULMONOLOGY_CLINIC: 'PULMONOLOGY_CLINIC',
  RHEUMATOLOGY_CLINIC: 'RHEUMATOLOGY_CLINIC',
  UROLOGY_CLINIC: 'UROLOGY_CLINIC',
  DIAGNOSTIC_LAB: 'DIAGNOSTIC_LAB',
  GENETIC_TESTING_LAB: 'GENETIC_TESTING_LAB',
  PATHOLOGY_LAB: 'PATHOLOGY_LAB',
  RADIOLOGY_CENTER: 'RADIOLOGY_CENTER',
  MICROBIOLOGY_LAB: 'MICROBIOLOGY_LAB',
  TOXICOLOGY_LAB: 'TOXICOLOGY_LAB',
  BURN_CENTER: 'BURN_CENTER',
  CRITICAL_CARE_CENTER: 'CRITICAL_CARE_CENTER',
  EMERGENCY_CENTER: 'EMERGENCY_CENTER',
  POISON_CONTROL_CENTER: 'POISON_CONTROL_CENTER',
  TRAUMA_CENTER: 'TRAUMA_CENTER',
  URGENT_CARE_CENTER: 'URGENT_CARE_CENTER',
  BLOOD_BANK: 'BLOOD_BANK',
  DIALYSIS_CENTER: 'DIALYSIS_CENTER',
  MENTAL_HEALTH_CENTER: 'MENTAL_HEALTH_CENTER',
  PAIN_MANAGEMENT_CENTER: 'PAIN_MANAGEMENT_CENTER',
  REHABILITATION_CENTER: 'REHABILITATION_CENTER',
  SLEEP_CENTER: 'SLEEP_CENTER',
  SUBSTANCE_ABUSE_CENTER: 'SUBSTANCE_ABUSE_CENTER',
  TRANSPLANT_CENTER: 'TRANSPLANT_CENTER',
  ALTERNATIVE_MEDICINE_CENTER: 'ALTERNATIVE_MEDICINE_CENTER',
  PHYSICAL_THERAPY_CENTER: 'PHYSICAL_THERAPY_CENTER',
  OCCUPATIONAL_THERAPY_CENTER: 'OCCUPATIONAL_THERAPY_CENTER',
  SPEECH_THERAPY_CENTER: 'SPEECH_THERAPY_CENTER',
  AMBULATORY_CARE_CENTER: 'AMBULATORY_CARE_CENTER',
  SURGICAL_CENTER: 'SURGICAL_CENTER',
  AMBULANCE_SERVICE: 'AMBULANCE_SERVICE'
};

exports.Ownership = exports.$Enums.Ownership = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

exports.Provider = exports.$Enums.Provider = {
  INTELLICARE: 'INTELLICARE',
  ASIACARE: 'ASIACARE',
  AVEGA: 'AVEGA',
  CAREWELL: 'CAREWELL',
  one_COOPHEALTH: 'one_COOPHEALTH',
  DYNAMIC_CARE_CORPORATION: 'DYNAMIC_CARE_CORPORATION',
  EASTWEST_HEALTHCARE: 'EASTWEST_HEALTHCARE',
  FORTICARE: 'FORTICARE',
  GETWELL: 'GETWELL',
  HC_and_D: 'HC_and_D',
  HEALTHFIRST: 'HEALTHFIRST',
  HMI: 'HMI',
  HPPI: 'HPPI',
  IWC: 'IWC',
  ICARE: 'ICARE',
  KAISER: 'KAISER',
  LIFE_and_HEALTH: 'LIFE_and_HEALTH',
  MAXICARE: 'MAXICARE',
  MEDICARD: 'MEDICARD',
  MEDICARE: 'MEDICARE',
  MEDOCARE: 'MEDOCARE',
  METROCARE: 'METROCARE',
  OMHSI: 'OMHSI',
  PACIFIC_CROSS: 'PACIFIC_CROSS',
  PHILHEALTH: 'PHILHEALTH',
  VALUCARE: 'VALUCARE',
  WELLCARE: 'WELLCARE'
};

exports.Role = exports.$Enums.Role = {
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN'
};

exports.Availability = exports.$Enums.Availability = {
  AVAILABLE: 'AVAILABLE',
  SHORT_DELAY: 'SHORT_DELAY',
  MODERATE_DELAY: 'MODERATE_DELAY',
  EXTENDED_DELAY: 'EXTENDED_DELAY',
  UNAVAILABLE: 'UNAVAILABLE'
};

exports.Load = exports.$Enums.Load = {
  STEADY: 'STEADY',
  MODERATE: 'MODERATE',
  CROWDED: 'CROWDED',
  NEAR_CAPACITY: 'NEAR_CAPACITY',
  FULL_CAPACITY: 'FULL_CAPACITY',
  CLOSED: 'CLOSED'
};

exports.ContactType = exports.$Enums.ContactType = {
  PHONE: 'PHONE',
  EMAIL: 'EMAIL'
};

exports.Action = exports.$Enums.Action = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
};

exports.Prisma.ModelName = {
  Region: 'Region',
  POrC: 'POrC',
  COrM: 'COrM',
  Brgy: 'Brgy',
  Address: 'Address',
  Facility: 'Facility',
  Division: 'Division',
  Employee: 'Employee',
  Session: 'Session',
  Service: 'Service',
  AmbulanceService: 'AmbulanceService',
  BloodTypeMapping: 'BloodTypeMapping',
  BloodBankService: 'BloodBankService',
  ERService: 'ERService',
  ICUService: 'ICUService',
  OutpatientService: 'OutpatientService',
  Contact: 'Contact',
  UpdateLog: 'UpdateLog'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
