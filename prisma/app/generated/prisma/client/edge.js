
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/edge.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\adria\\OneDrive\\Documents\\YEAR 3, SEM 2\\CS 192\\CS192MedLink\\prisma\\app\\generated\\prisma\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\adria\\OneDrive\\Documents\\YEAR 3, SEM 2\\CS 192\\CS192MedLink\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../../../.env",
    "schemaEnvPath": "../../../../../.env"
  },
  "relativePath": "../../../..",
  "clientVersion": "6.4.1",
  "engineVersion": "a9055b89e58b4b5bfb59600785423b1db3d0e75d",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider = \"prisma-client-js\"\n  output   = \"app/generated/prisma/client\"\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DIRECT_URL\")\n}\n\n// MODELS\n\nmodel Region {\n  regionID Int @id\n\n  name String @unique\n  id   Int    @default(autoincrement())\n\n  // RELATIONS\n\n  // Region - POrC : A Region may have multiple Provinces or Cities.\n\n  pOrCs POrC[]\n\n  // Region - Address : A Region may be referenced by multiple Addresses.\n\n  addresses Address[]\n}\n\nmodel POrC {\n  pOrCID Int @id\n\n  name String @unique\n  id   Int    @default(autoincrement())\n\n  // RELATIONS\n\n  // POrC - Region : A Province is associated with one Region.\n\n  region   Region @relation(fields: [regionID], references: [regionID])\n  regionID Int\n\n  // POrC - COrM : A Province may have multiple Cities or Municipalities.\n\n  cOrMs COrM[]\n\n  // POrC - Address : A Province may be referenced by multiple Addresses.\n\n  addresses Address[]\n}\n\nmodel COrM {\n  cOrMID Int @id\n\n  name String\n  id   Int    @default(autoincrement())\n\n  // RELATIONS\n\n  // COrM - POrC : A City or Municipality is associated with one Province.\n\n  pOrC   POrC @relation(fields: [pOrCID], references: [pOrCID])\n  pOrCID Int\n\n  // COrM - Brgy : A City or Municipality may have multiple Barangays.\n\n  brgys Brgy[]\n\n  // COrM - Address : A Municipality or Barangay may be referenced by multiple Addresses.\n\n  addresses Address[]\n}\n\nmodel Brgy {\n  brgyID Int @id\n\n  name String\n  id   Int    @default(autoincrement())\n\n  // RELATIONS\n\n  // Brgy - COrM : A Barangay is associated with one City or Municipality.\n\n  cOrM   COrM @relation(fields: [cOrMID], references: [cOrMID])\n  cOrMID Int\n\n  // Brgy - Address : A Barangay may be referenced by multiple Addresses.\n\n  addresses Address[]\n}\n\n// Address cohesion is (e.g. region = 3, pOrC = NCR, COrM = Platero is not allowed) is handled by business logic.\n\n// A separate Prisma model may not be so good for performance but a needed cop-out solution because only Prisma + MongoDB supports composite attributes.\n\nmodel Address {\n  region   Region @relation(fields: [regionID], references: [regionID])\n  regionID Int\n\n  pOrC   POrC @relation(fields: [pOrCID], references: [pOrCID])\n  pOrCID Int\n\n  cOrM   COrM @relation(fields: [cOrMID], references: [cOrMID])\n  cOrMID Int\n\n  brgy   Brgy @relation(fields: [brgyID], references: [brgyID])\n  brgyID Int\n\n  street String\n\n  // RELATIONS\n\n  // Address - Facility : An Address is tied to one Facility.\n\n  facility   Facility @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n  facilityID String   @id\n\n  @@unique([regionID, pOrCID, cOrMID, brgyID, street]) // Ensures each Facility has a unique Address.\n}\n\nmodel Facility {\n  facilityID String @id @default(dbgenerated(\"randomid()\")) @db.Text\n\n  name              String\n  photo             String\n  address           Address? // \"?\" because Prisma cannot enforce \"at least one ...\" constraints.\n  openingTime       DateTime?    @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  closingTime       DateTime?    @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  facilityType      FacilityType\n  ownership         Ownership // Enum: PUBLIC or PRIVATE\n  bookingSystem     String?\n  acceptedProviders Provider[]\n  updatedAt         DateTime     @updatedAt\n\n  // RELATIONS\n\n  // Facility - Contact :\n\n  // If a Facility has no Divisions, it must have at least one Phone Number. This constraint is handled by business logic.\n\n  // If it has Divisions, it may still have Phone Numbers, but it is not required.\n\n  // A Facility may or may not have Emails regardless of whether it has Divisions. \n\n  contacts Contact[]\n\n  // operatingHours OperatingHour[]\n\n  // Facility - Service : A Facility must have at least one Service. This constraint is handled by business logic.\n\n  // A Facility may have exactly one of each specialized Service: Ambulance, Blood Bank, Emergency Room, Intensive Care Unit, or multiple Outpatient Services. This constraint is handled by business logic.\n\n  services Service[]\n\n  // Facility - Manager : A Facility must have exactly one Manager. This constraint is handled by business logic.\n\n  // Facility - Admin : A Facility may or may not have Admins.\n\n  employees Employee[]\n\n  // Facility - Division : A Facility may or may not have Divisions.\n\n  divisions Division[]\n\n  // Facility - Update Log : A Facility may or may not have Update Logs.\n\n  logs UpdateLog[]\n}\n\nmodel Division {\n  divisionID String @id @default(dbgenerated(\"randomid()\")) @db.Text\n\n  name        String\n  openingTime DateTime @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  closingTime DateTime @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  // RELATIONS\n\n  // Division - Contact :\n\n  // A Division must have at least one Phone Number. This constraint is handled by business logic.\n\n  // A Division may or may not have Emails.\n\n  contacts Contact[]\n\n  // operatingHours OperatingHour[]\n\n  // Facility - Divisions : A Facility may or may not have Divisions.\n\n  facility   Facility @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n  facilityID String\n\n  // Division - Service : A Division must have at least one Service. This constraint is handled by business logic.\n\n  // A Division may have exactly one of each specialized Service (Ambulance, Blood Bank, Emergency Room, Intensive Care Unit) or multiple Outpatient Services. This constraint is handled by business logic.\n\n  services Service[]\n\n  // Division - Admin : A Division may or may not have Admins.\n\n  admins Employee[]\n\n  // Division - Update Log : A Division may or may not have Update Logs.\n\n  logs UpdateLog[]\n}\n\n// Table for both Managers and Admins of a Facility.\n\nmodel Employee {\n  employeeID String @id @default(dbgenerated(\"randomid()\")) @db.Text\n\n  password String\n\n  role      Role\n  fname     String\n  mname     String?\n  lname     String\n  photo     String   @default(\"https://placehold.co/1080x1080/png\")\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // RELATIONS\n\n  sessions Session[]\n\n  // Manager - Facility : A Manager must work for exactly one Facility.\n\n  // Admin - Facility : An Admin must work for exactly one Facility.\n\n  facility   Facility @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n  facilityID String\n\n  // Admin - Division : If a Facility has Divisions, every Admin must be assigned to at least one Division. This constraint is handled by business logic.\n\n  divisions Division[]\n\n  // Employee : An Employee may or may not be associated with Update Logs.\n\n  updateLog UpdateLog[]\n}\n\nmodel Session {\n  sessionID String @id\n\n  expiresAt DateTime\n\n  employee   Employee @relation(fields: [employeeID], references: [employeeID])\n  employeeID String\n}\n\nmodel Service {\n  serviceID String @id @default(dbgenerated(\"randomid()\")) @db.Text\n\n  type      String\n  keywords  String[]\n  note      String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // RELATIONS\n\n  // Service - Contact :\n\n  // A specialized Service (Ambulance, Blood Bank, Emergency Room, Intensive Care Unit) may or may not have its own Phone Numbers.\n\n  // If a specialized Service has no Phone Numbers, it is associated with the Phone Numbers of its offering Facility or Division.\n\n  // Outpatient Services are always associated with the Phone Numbers of their offering Facility or Division.\n\n  // JOKE LANG HEHE BUSINESS LOGIC LAYER NA TO\n\n  phoneNumbers Contact[]\n\n  // operatingHours OperatingHour[]\n\n  // Service - Facility : A Service must belong to exactly one Facility.\n\n  facility   Facility @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n  facilityID String\n\n  // Service - Division : If a Facility has Divisions, every Service must belong to a Division.\n\n  division   Division? @relation(fields: [divisionID], references: [divisionID], onDelete: SetNull) // More sophisticated deletion handling is handled by business logic.\n  divisionID String?\n\n  // Links to specific Services\n  ambulanceService  AmbulanceService?\n  bloodBankService  BloodBankService?\n  erService         ERService?\n  icuService        ICUService?\n  outpatientService OutpatientService?\n\n  // REMINDER FOR PAUL: DO POSTGRESQL MANUAL ENFORCEMENT OF RELATION THINGIES\n\n  @@unique([facilityID, type]) // Ensures one Service of a specific type exists per Facility.\n}\n\nmodel AmbulanceService {\n  openingTime       DateTime?    @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  closingTime       DateTime?    @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  availability      Availability @default(UNAVAILABLE)\n  baseRate          Float\n  minCoverageRadius Float\n  mileageRate       Float\n  maxCoverageRadius Float\n\n  // RELATIONS\n\n  service   Service @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID String  @id\n}\n\nmodel BloodTypeMapping {\n  // Naming Convention: _P = Positive, _N = Negative\n  A_P  Boolean @default(false)\n  A_N  Boolean @default(false)\n  B_P  Boolean @default(false)\n  B_N  Boolean @default(false)\n  O_P  Boolean @default(false)\n  O_N  Boolean @default(false)\n  AB_P Boolean @default(false)\n  AB_N Boolean @default(false)\n\n  // RELATIONS\n\n  BloodBankService BloodBankService @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID        String           @id\n}\n\nmodel BloodBankService {\n  openingTime           DateTime?         @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  closingTime           DateTime?         @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  basePricePerUnit      Float\n  turnaroundTimeD       Int // Day.\n  turnaroundTimeH       Int // Hour. The limit to its possible values (0 - 23) is handled by business logic.\n  bloodTypeAvailability BloodTypeMapping? // \"?\" because Prisma cannot enforce \"at least one ...\" constraints.\n\n  // RELATIONS\n\n  service   Service @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID String  @id\n}\n\nmodel ERService {\n  openingTime          DateTime? @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  closingTime          DateTime? @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  load                 Load      @default(CLOSED)\n  availableBeds        Int       @default(0)\n  nonUrgentPatients    Int       @default(0)\n  nonUrgentQueueLength Int       @default(0)\n  urgentPatients       Int       @default(0)\n  urgentQueueLength    Int       @default(0)\n  criticalPatients     Int       @default(0)\n  criticalQueueLength  Int       @default(0)\n\n  // RELATIONS\n\n  service   Service @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID String  @id\n}\n\nmodel ICUService {\n  openingTime         DateTime? @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  closingTime         DateTime? @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic. // TEMPORARY\n  load                Load      @default(CLOSED)\n  baseRate            Float\n  availableBeds       Int       @default(0)\n  cardiacSupport      Boolean   @default(false)\n  neurologicalSupport Boolean   @default(false)\n  renalSupport        Boolean   @default(false)\n  respiratorySupport  Boolean   @default(false)\n\n  // RELATIONS\n\n  service   Service @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID String  @id\n}\n\nmodel OutpatientService {\n  basePrice       Float\n  completionTimeD Int // Day.\n  completionTimeH Int // Hour. The limit to its possible values (0 - 23) is handled by business logic.\n  isAvailable     Boolean @default(false)\n  acceptsWalkIns  Boolean\n\n  // RELATIONS\n\n  service   Service @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID String  @id\n}\n\nmodel Contact {\n  contactID String      @id @default(dbgenerated(\"randomid()\")) @db.Text\n  info      String      @unique // Either a Phone Number or an Email.\n  type      ContactType // Enum: PHONE or EMAIL\n\n  // RELATIONS \n\n  // A Contact may be associated with either a Facility, a Division, or a specialized Service.\n\n  facility   Facility? @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n  facilityID String?\n\n  division   Division? @relation(fields: [divisionID], references: [divisionID], onDelete: Cascade)\n  divisionID String?\n\n  service   Service? @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n  serviceID String?\n\n  // REMINDER FOR PAUL: DO POSTGRESQL MANUAL ENFORCEMENT OF RELATION THINGIES\n}\n\n/**\n * model OperatingHour {\n * operatingHourID String   @id @default(dbgenerated(\"randomid()\")) @db.Text\n * day             Day\n * openingTime     DateTime @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic.\n * closingTime     DateTime @db.Time(0) // Format: 00:00:00. In UTC. Timezone conversion is handled by business logic.\n * // RELATIONS\n * // An Operating Hour may be related to a Facility or a Division, or a specialized Service. This constraint is handled by business logic.\n * facility   Facility? @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n * facilityID String?\n * division   Division? @relation(fields: [divisionID], references: [divisionID], onDelete: Cascade)\n * divisionID String?\n * service    Service?  @relation(fields: [serviceID], references: [serviceID], onDelete: Cascade)\n * serviceID  String?\n * // REMINDER FOR PAUL: DO POSTGRESQL MANUAL ENFORCEMENT OF RELATION THINGIES\n * @@unique([day, facilityID])\n * @@unique([day, divisionID])\n * @@unique([day, serviceID])\n * }\n */\n\nmodel UpdateLog {\n  updateLogID String @id @default(dbgenerated(\"randomid()\")) @db.Text\n\n  entity    String\n  action    Action\n  createdAt DateTime @default(now())\n\n  // Update Log - Facility : An Update Log is linked to exactly one Facility.\n  facility   Facility @relation(fields: [facilityID], references: [facilityID], onDelete: Cascade)\n  facilityID String\n\n  // Update Log - Division : If a Facility has Divisions, every Update Log must be linked to exactly one Division.\n  division   Division? @relation(fields: [divisionID], references: [divisionID], onDelete: Cascade)\n  divisionID String?\n\n  // Update Log - Employee : An Update Log is linked to exactly one Employee, who is either a Manager or an Admin.\n  employee   Employee @relation(fields: [employeeID], references: [employeeID], onDelete: Cascade)\n  employeeID String\n}\n\n// ENUMS\n\nenum FacilityType {\n  // Hospitals & General Medical Centers  \n  BARANGAY_HEALTH_CENTER\n  CLINIC\n  HEALTH_CENTER\n  HOSPITAL\n  INFIRMARY\n  POLYCLINIC\n  PRIMARY_CARE_CLINIC\n\n  // Specialty Medical Clinics\n  ALLERGY_CLINIC\n  CARDIOLOGY_CLINIC\n  DENTAL_CLINIC\n  DERMATOLOGY_CLINIC\n  ENDOCRINOLOGY_CLINIC\n  ENT_CLINIC\n  FERTILITY_CLINIC\n  GASTROENTEROLOGY_CLINIC\n  IMMUNOLOGY_CLINIC\n  INFECTIOUS_DISEASE_CLINIC\n  MATERNITY_CLINIC\n  NEPHROLOGY_CLINIC\n  NEUROLOGY_CLINIC\n  ONCOLOGY_CLINIC\n  OPHTHALMOLOGY_CLINIC\n  ORTHOPEDIC_CLINIC\n  PEDIATRIC_CLINIC\n  PULMONOLOGY_CLINIC\n  RHEUMATOLOGY_CLINIC\n  UROLOGY_CLINIC\n\n  // Diagnostic & Laboratory Facilities\n  DIAGNOSTIC_LAB\n  GENETIC_TESTING_LAB\n  PATHOLOGY_LAB\n  RADIOLOGY_CENTER\n  MICROBIOLOGY_LAB\n  TOXICOLOGY_LAB\n\n  // Emergency & Critical Care\n  BURN_CENTER\n  CRITICAL_CARE_CENTER\n  EMERGENCY_CENTER\n  POISON_CONTROL_CENTER\n  TRAUMA_CENTER\n  URGENT_CARE_CENTER\n\n  // Specialized Treatment Centers\n  BLOOD_BANK\n  DIALYSIS_CENTER\n  MENTAL_HEALTH_CENTER\n  PAIN_MANAGEMENT_CENTER\n  REHABILITATION_CENTER\n  SLEEP_CENTER\n  SUBSTANCE_ABUSE_CENTER\n  TRANSPLANT_CENTER\n\n  // Therapy & Alternative Medicine\n  ALTERNATIVE_MEDICINE_CENTER\n  PHYSICAL_THERAPY_CENTER\n  OCCUPATIONAL_THERAPY_CENTER\n  SPEECH_THERAPY_CENTER\n\n  // Surgical & Ambulatory Care\n  AMBULATORY_CARE_CENTER\n  SURGICAL_CENTER\n\n  // Ambulance Services\n  AMBULANCE_SERVICE\n}\n\nenum Ownership {\n  PUBLIC\n  PRIVATE\n}\n\nenum Provider {\n  INTELLICARE // Asalus Corporation\n  ASIACARE // Asiancare Health Systems, Inc.\n  AVEGA // Avega Managed Care, Inc.\n  CAREWELL // Carewell Health Systems, Inc.\n  one_COOPHEALTH // Cooperative Health Management Federation\n  DYNAMIC_CARE_CORPORATION // Dynamic Care Corporation\n  EASTWEST_HEALTHCARE // EastWest Healthcare, Inc.\n  FORTICARE // Forticare Health Systems International, Inc.\n  GETWELL // Getwell Health Systems, Inc.\n  HC_and_D // Healthcare and Development Corporation of the Philippines\n  HEALTHFIRST // Health Delivery System, Inc.\n  HMI // Health Maintenance, Inc. // has optional Dental Plan\n  HPPI // Health Plan Philippines, Inc.\n  IWC // IMS Wellth Care, Inc.\n  ICARE // Insular Health Care, Inc.\n  KAISER // Kaiser International Healthgroup, Inc.\n  LIFE_and_HEALTH // Life & Health HMP, Inc.\n  MAXICARE // Maxicare Healthcare Corp.\n  MEDICARD // Medicard Philippines, Inc.\n  MEDICARE // iMedicare Plus, Inc.\n  MEDOCARE // Medocare Health Systems, Inc.\n  METROCARE // Metrocare Health Systems, Incorporated\n  OMHSI // Optimum Medical and Healthcare Services, Inc.\n  PACIFIC_CROSS // Pacific Cross Health Care, Inc.\n  PHILHEALTH // PhilhealthCare, Inc.\n  VALUCARE // Value Care Health Systems, Inc.\n  WELLCARE // Wellcare Health Maintenance, Inc.\n}\n\nenum Role {\n  MANAGER\n  ADMIN\n}\n\nenum Availability {\n  AVAILABLE\n  SHORT_DELAY\n  MODERATE_DELAY\n  EXTENDED_DELAY\n  UNAVAILABLE\n}\n\nenum Load {\n  STEADY\n  MODERATE\n  CROWDED\n  NEAR_CAPACITY\n  FULL_CAPACITY\n  CLOSED\n}\n\nenum ContactType {\n  PHONE\n  EMAIL\n}\n\n/**\n * enum Day {\n * MON\n * TUE\n * WED\n * THU\n * FRI\n * SAT\n * SUN\n * }\n */\n\nenum Action {\n  CREATE\n  UPDATE\n  DELETE\n}\n",
  "inlineSchemaHash": "2185bc86ebc4a333861577bdd0e69db07eb3268419d65b92932fb9f9dc151619",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Region\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"regionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pOrCs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"POrC\",\"nativeType\":null,\"relationName\":\"POrCToRegion\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"nativeType\":null,\"relationName\":\"AddressToRegion\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"POrC\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"pOrCID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"region\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Region\",\"nativeType\":null,\"relationName\":\"POrCToRegion\",\"relationFromFields\":[\"regionID\"],\"relationToFields\":[\"regionID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"regionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cOrMs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"COrM\",\"nativeType\":null,\"relationName\":\"COrMToPOrC\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"nativeType\":null,\"relationName\":\"AddressToPOrC\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"COrM\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"cOrMID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pOrC\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"POrC\",\"nativeType\":null,\"relationName\":\"COrMToPOrC\",\"relationFromFields\":[\"pOrCID\"],\"relationToFields\":[\"pOrCID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pOrCID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brgys\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brgy\",\"nativeType\":null,\"relationName\":\"BrgyToCOrM\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"nativeType\":null,\"relationName\":\"AddressToCOrM\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Brgy\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"brgyID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cOrM\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"COrM\",\"nativeType\":null,\"relationName\":\"BrgyToCOrM\",\"relationFromFields\":[\"cOrMID\"],\"relationToFields\":[\"cOrMID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cOrMID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"addresses\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"nativeType\":null,\"relationName\":\"AddressToBrgy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Address\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"region\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Region\",\"nativeType\":null,\"relationName\":\"AddressToRegion\",\"relationFromFields\":[\"regionID\"],\"relationToFields\":[\"regionID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"regionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pOrC\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"POrC\",\"nativeType\":null,\"relationName\":\"AddressToPOrC\",\"relationFromFields\":[\"pOrCID\"],\"relationToFields\":[\"pOrCID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pOrCID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cOrM\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"COrM\",\"nativeType\":null,\"relationName\":\"AddressToCOrM\",\"relationFromFields\":[\"cOrMID\"],\"relationToFields\":[\"cOrMID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cOrMID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brgy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Brgy\",\"nativeType\":null,\"relationName\":\"AddressToBrgy\",\"relationFromFields\":[\"brgyID\"],\"relationToFields\":[\"brgyID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"brgyID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"street\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"nativeType\":null,\"relationName\":\"AddressToFacility\",\"relationFromFields\":[\"facilityID\"],\"relationToFields\":[\"facilityID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"regionID\",\"pOrCID\",\"cOrMID\",\"brgyID\",\"street\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"regionID\",\"pOrCID\",\"cOrMID\",\"brgyID\",\"street\"]}],\"isGenerated\":false},\"Facility\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"default\":{\"name\":\"dbgenerated\",\"args\":[\"randomid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"photo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"address\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Address\",\"nativeType\":null,\"relationName\":\"AddressToFacility\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FacilityType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownership\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ownership\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bookingSystem\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acceptedProviders\",\"kind\":\"enum\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Provider\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"contacts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Contact\",\"nativeType\":null,\"relationName\":\"ContactToFacility\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"services\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"FacilityToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employees\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"nativeType\":null,\"relationName\":\"EmployeeToFacility\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divisions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"relationName\":\"DivisionToFacility\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UpdateLog\",\"nativeType\":null,\"relationName\":\"FacilityToUpdateLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Division\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"divisionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"default\":{\"name\":\"dbgenerated\",\"args\":[\"randomid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"openingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"contacts\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Contact\",\"nativeType\":null,\"relationName\":\"ContactToDivision\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"nativeType\":null,\"relationName\":\"DivisionToFacility\",\"relationFromFields\":[\"facilityID\"],\"relationToFields\":[\"facilityID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"services\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"DivisionToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"admins\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"nativeType\":null,\"relationName\":\"DivisionToEmployee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logs\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UpdateLog\",\"nativeType\":null,\"relationName\":\"DivisionToUpdateLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Employee\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"employeeID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"default\":{\"name\":\"dbgenerated\",\"args\":[\"randomid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"password\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Role\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"lname\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"photo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":null,\"default\":\"https://placehold.co/1080x1080/png\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"sessions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Session\",\"nativeType\":null,\"relationName\":\"EmployeeToSession\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"nativeType\":null,\"relationName\":\"EmployeeToFacility\",\"relationFromFields\":[\"facilityID\"],\"relationToFields\":[\"facilityID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divisions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"relationName\":\"DivisionToEmployee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updateLog\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"UpdateLog\",\"nativeType\":null,\"relationName\":\"EmployeeToUpdateLog\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Session\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"sessionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"nativeType\":null,\"relationName\":\"EmployeeToSession\",\"relationFromFields\":[\"employeeID\"],\"relationToFields\":[\"employeeID\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employeeID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Service\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"default\":{\"name\":\"dbgenerated\",\"args\":[\"randomid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"keywords\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"note\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"phoneNumbers\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Contact\",\"nativeType\":null,\"relationName\":\"ContactToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"nativeType\":null,\"relationName\":\"FacilityToService\",\"relationFromFields\":[\"facilityID\"],\"relationToFields\":[\"facilityID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"relationName\":\"DivisionToService\",\"relationFromFields\":[\"divisionID\"],\"relationToFields\":[\"divisionID\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divisionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ambulanceService\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AmbulanceService\",\"nativeType\":null,\"relationName\":\"AmbulanceServiceToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bloodBankService\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BloodBankService\",\"nativeType\":null,\"relationName\":\"BloodBankServiceToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"erService\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ERService\",\"nativeType\":null,\"relationName\":\"ERServiceToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"icuService\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ICUService\",\"nativeType\":null,\"relationName\":\"ICUServiceToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"outpatientService\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"OutpatientService\",\"nativeType\":null,\"relationName\":\"OutpatientServiceToService\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"facilityID\",\"type\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"facilityID\",\"type\"]}],\"isGenerated\":false},\"AmbulanceService\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"openingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"availability\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Availability\",\"nativeType\":null,\"default\":\"UNAVAILABLE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"minCoverageRadius\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"mileageRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"maxCoverageRadius\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"AmbulanceServiceToService\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BloodTypeMapping\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"A_P\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"A_N\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"B_P\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"B_N\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"O_P\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"O_N\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"AB_P\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"AB_N\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"BloodBankService\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BloodBankService\",\"nativeType\":null,\"relationName\":\"BloodBankServiceToBloodTypeMapping\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"BloodBankService\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"openingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"basePricePerUnit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"turnaroundTimeD\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"turnaroundTimeH\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"bloodTypeAvailability\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BloodTypeMapping\",\"nativeType\":null,\"relationName\":\"BloodBankServiceToBloodTypeMapping\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"BloodBankServiceToService\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ERService\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"openingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"load\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Load\",\"nativeType\":null,\"default\":\"CLOSED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"availableBeds\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nonUrgentPatients\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nonUrgentQueueLength\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"urgentPatients\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"urgentQueueLength\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criticalPatients\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"criticalQueueLength\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"ERServiceToService\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ICUService\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"openingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"closingTime\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"nativeType\":[\"Time\",[\"0\"]],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"load\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Load\",\"nativeType\":null,\"default\":\"CLOSED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"baseRate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"availableBeds\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"nativeType\":null,\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cardiacSupport\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"neurologicalSupport\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"renalSupport\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"respiratorySupport\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"ICUServiceToService\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"OutpatientService\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"basePrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completionTimeD\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completionTimeH\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"isAvailable\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"nativeType\":null,\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"acceptsWalkIns\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Boolean\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"OutpatientServiceToService\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Contact\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"contactID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"default\":{\"name\":\"dbgenerated\",\"args\":[\"randomid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"info\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ContactType\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"nativeType\":null,\"relationName\":\"ContactToFacility\",\"relationFromFields\":[\"facilityID\"],\"relationToFields\":[\"facilityID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"relationName\":\"ContactToDivision\",\"relationFromFields\":[\"divisionID\"],\"relationToFields\":[\"divisionID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divisionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"service\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Service\",\"nativeType\":null,\"relationName\":\"ContactToService\",\"relationFromFields\":[\"serviceID\"],\"relationToFields\":[\"serviceID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"UpdateLog\":{\"dbName\":null,\"schema\":null,\"fields\":[{\"name\":\"updateLogID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"nativeType\":[\"Text\",[]],\"default\":{\"name\":\"dbgenerated\",\"args\":[\"randomid()\"]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Action\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"nativeType\":null,\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facility\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Facility\",\"nativeType\":null,\"relationName\":\"FacilityToUpdateLog\",\"relationFromFields\":[\"facilityID\"],\"relationToFields\":[\"facilityID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facilityID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"division\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Division\",\"nativeType\":null,\"relationName\":\"DivisionToUpdateLog\",\"relationFromFields\":[\"divisionID\"],\"relationToFields\":[\"divisionID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"divisionID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Employee\",\"nativeType\":null,\"relationName\":\"EmployeeToUpdateLog\",\"relationFromFields\":[\"employeeID\"],\"relationToFields\":[\"employeeID\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"employeeID\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"nativeType\":null,\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"FacilityType\":{\"values\":[{\"name\":\"BARANGAY_HEALTH_CENTER\",\"dbName\":null},{\"name\":\"CLINIC\",\"dbName\":null},{\"name\":\"HEALTH_CENTER\",\"dbName\":null},{\"name\":\"HOSPITAL\",\"dbName\":null},{\"name\":\"INFIRMARY\",\"dbName\":null},{\"name\":\"POLYCLINIC\",\"dbName\":null},{\"name\":\"PRIMARY_CARE_CLINIC\",\"dbName\":null},{\"name\":\"ALLERGY_CLINIC\",\"dbName\":null},{\"name\":\"CARDIOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"DENTAL_CLINIC\",\"dbName\":null},{\"name\":\"DERMATOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"ENDOCRINOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"ENT_CLINIC\",\"dbName\":null},{\"name\":\"FERTILITY_CLINIC\",\"dbName\":null},{\"name\":\"GASTROENTEROLOGY_CLINIC\",\"dbName\":null},{\"name\":\"IMMUNOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"INFECTIOUS_DISEASE_CLINIC\",\"dbName\":null},{\"name\":\"MATERNITY_CLINIC\",\"dbName\":null},{\"name\":\"NEPHROLOGY_CLINIC\",\"dbName\":null},{\"name\":\"NEUROLOGY_CLINIC\",\"dbName\":null},{\"name\":\"ONCOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"OPHTHALMOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"ORTHOPEDIC_CLINIC\",\"dbName\":null},{\"name\":\"PEDIATRIC_CLINIC\",\"dbName\":null},{\"name\":\"PULMONOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"RHEUMATOLOGY_CLINIC\",\"dbName\":null},{\"name\":\"UROLOGY_CLINIC\",\"dbName\":null},{\"name\":\"DIAGNOSTIC_LAB\",\"dbName\":null},{\"name\":\"GENETIC_TESTING_LAB\",\"dbName\":null},{\"name\":\"PATHOLOGY_LAB\",\"dbName\":null},{\"name\":\"RADIOLOGY_CENTER\",\"dbName\":null},{\"name\":\"MICROBIOLOGY_LAB\",\"dbName\":null},{\"name\":\"TOXICOLOGY_LAB\",\"dbName\":null},{\"name\":\"BURN_CENTER\",\"dbName\":null},{\"name\":\"CRITICAL_CARE_CENTER\",\"dbName\":null},{\"name\":\"EMERGENCY_CENTER\",\"dbName\":null},{\"name\":\"POISON_CONTROL_CENTER\",\"dbName\":null},{\"name\":\"TRAUMA_CENTER\",\"dbName\":null},{\"name\":\"URGENT_CARE_CENTER\",\"dbName\":null},{\"name\":\"BLOOD_BANK\",\"dbName\":null},{\"name\":\"DIALYSIS_CENTER\",\"dbName\":null},{\"name\":\"MENTAL_HEALTH_CENTER\",\"dbName\":null},{\"name\":\"PAIN_MANAGEMENT_CENTER\",\"dbName\":null},{\"name\":\"REHABILITATION_CENTER\",\"dbName\":null},{\"name\":\"SLEEP_CENTER\",\"dbName\":null},{\"name\":\"SUBSTANCE_ABUSE_CENTER\",\"dbName\":null},{\"name\":\"TRANSPLANT_CENTER\",\"dbName\":null},{\"name\":\"ALTERNATIVE_MEDICINE_CENTER\",\"dbName\":null},{\"name\":\"PHYSICAL_THERAPY_CENTER\",\"dbName\":null},{\"name\":\"OCCUPATIONAL_THERAPY_CENTER\",\"dbName\":null},{\"name\":\"SPEECH_THERAPY_CENTER\",\"dbName\":null},{\"name\":\"AMBULATORY_CARE_CENTER\",\"dbName\":null},{\"name\":\"SURGICAL_CENTER\",\"dbName\":null},{\"name\":\"AMBULANCE_SERVICE\",\"dbName\":null}],\"dbName\":null},\"Ownership\":{\"values\":[{\"name\":\"PUBLIC\",\"dbName\":null},{\"name\":\"PRIVATE\",\"dbName\":null}],\"dbName\":null},\"Provider\":{\"values\":[{\"name\":\"INTELLICARE\",\"dbName\":null},{\"name\":\"ASIACARE\",\"dbName\":null},{\"name\":\"AVEGA\",\"dbName\":null},{\"name\":\"CAREWELL\",\"dbName\":null},{\"name\":\"one_COOPHEALTH\",\"dbName\":null},{\"name\":\"DYNAMIC_CARE_CORPORATION\",\"dbName\":null},{\"name\":\"EASTWEST_HEALTHCARE\",\"dbName\":null},{\"name\":\"FORTICARE\",\"dbName\":null},{\"name\":\"GETWELL\",\"dbName\":null},{\"name\":\"HC_and_D\",\"dbName\":null},{\"name\":\"HEALTHFIRST\",\"dbName\":null},{\"name\":\"HMI\",\"dbName\":null},{\"name\":\"HPPI\",\"dbName\":null},{\"name\":\"IWC\",\"dbName\":null},{\"name\":\"ICARE\",\"dbName\":null},{\"name\":\"KAISER\",\"dbName\":null},{\"name\":\"LIFE_and_HEALTH\",\"dbName\":null},{\"name\":\"MAXICARE\",\"dbName\":null},{\"name\":\"MEDICARD\",\"dbName\":null},{\"name\":\"MEDICARE\",\"dbName\":null},{\"name\":\"MEDOCARE\",\"dbName\":null},{\"name\":\"METROCARE\",\"dbName\":null},{\"name\":\"OMHSI\",\"dbName\":null},{\"name\":\"PACIFIC_CROSS\",\"dbName\":null},{\"name\":\"PHILHEALTH\",\"dbName\":null},{\"name\":\"VALUCARE\",\"dbName\":null},{\"name\":\"WELLCARE\",\"dbName\":null}],\"dbName\":null},\"Role\":{\"values\":[{\"name\":\"MANAGER\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null}],\"dbName\":null},\"Availability\":{\"values\":[{\"name\":\"AVAILABLE\",\"dbName\":null},{\"name\":\"SHORT_DELAY\",\"dbName\":null},{\"name\":\"MODERATE_DELAY\",\"dbName\":null},{\"name\":\"EXTENDED_DELAY\",\"dbName\":null},{\"name\":\"UNAVAILABLE\",\"dbName\":null}],\"dbName\":null},\"Load\":{\"values\":[{\"name\":\"STEADY\",\"dbName\":null},{\"name\":\"MODERATE\",\"dbName\":null},{\"name\":\"CROWDED\",\"dbName\":null},{\"name\":\"NEAR_CAPACITY\",\"dbName\":null},{\"name\":\"FULL_CAPACITY\",\"dbName\":null},{\"name\":\"CLOSED\",\"dbName\":null}],\"dbName\":null},\"ContactType\":{\"values\":[{\"name\":\"PHONE\",\"dbName\":null},{\"name\":\"EMAIL\",\"dbName\":null}],\"dbName\":null},\"Action\":{\"values\":[{\"name\":\"CREATE\",\"dbName\":null},{\"name\":\"UPDATE\",\"dbName\":null},{\"name\":\"DELETE\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

