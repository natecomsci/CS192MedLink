-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('INTELLICARE', 'ASIACARE', 'AVEGA', 'CAREWELL', 'one_COOPHEALTH', 'DYNAMIC_CARE_CORPORATION', 'EASTWEST_HEALTHCARE', 'FORTICARE', 'GETWELL', 'HC_and_D', 'HEALTHFIRST', 'HMI', 'HPPI', 'IWC', 'ICARE', 'KAISER', 'LIFE_and_HEALTH', 'MAXICARE', 'MEDICARD', 'MEDICARE', 'MEDOCARE', 'METROCARE', 'OMHSI', 'PACIFIC_CROSS', 'PHILHEALTH', 'VALUCARE', 'WELLCARE');

-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('BARANGAY_HEALTH_CENTER', 'CLINIC', 'HEALTH_CENTER', 'HOSPITAL', 'INFIRMARY', 'POLYCLINIC', 'PRIMARY_CARE_CLINIC', 'CARDIOLOGY_CLINIC', 'DENTAL_CLINIC', 'DERMATOLOGY_CLINIC', 'ENDOCRINOLOGY_CLINIC', 'ENT_CLINIC', 'FERTILITY_CLINIC', 'GASTROENTEROLOGY_CLINIC', 'IMMUNOLOGY_CENTER', 'INFECTIOUS_DISEASE_CENTER', 'MATERNITY_CENTER', 'NEPHROLOGY_CLINIC', 'NEUROLOGY_CLINIC', 'ONCOLOGY_CENTER', 'OPHTHALMOLOGY_CLINIC', 'ORTHOPEDIC_CLINIC', 'PEDIATRIC_CLINIC', 'PULMONOLOGY_CLINIC', 'RHEUMATOLOGY_CLINIC', 'UROLOGY_CLINIC', 'DIAGNOSTIC_LAB', 'GENETIC_TESTING_LAB', 'PATHOLOGY_LAB', 'RADIOLOGY_CENTER', 'BURN_CENTER', 'CRITICAL_CARE_CENTER', 'EMERGENCY_CENTER', 'POISON_CONTROL_CENTER', 'TRAUMA_CENTER', 'URGENT_CARE_CENTER', 'BLOOD_BANK', 'DIALYSIS_CENTER', 'MENTAL_HEALTH_FACILITY', 'PAIN_MANAGEMENT_CLINIC', 'REHABILITATION_CENTER', 'SLEEP_CENTER', 'SUBSTANCE_ABUSE_CENTER', 'TRANSPLANT_CENTER', 'ALTERNATIVE_MEDICINE_CENTER', 'HERBAL_MEDICINE_CENTER', 'PHYSICAL_THERAPY_CENTER', 'AMBULATORY_CARE_CENTER', 'SURGICAL_CENTER', 'AMBULANCE_SERVICE');

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'SHORT_DELAY', 'MODERATE_DELAY', 'EXTENDED_DELAY', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "Load" AS ENUM ('STEADY', 'MODERATE', 'CROWDED', 'NEAR_CAPACITY', 'FULL_CAPACITY', 'CLOSED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MANAGER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "Region" (
    "regionID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("regionID")
);

-- CreateTable
CREATE TABLE "POrC" (
    "pOrCID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "regionID" INTEGER NOT NULL,

    CONSTRAINT "POrC_pkey" PRIMARY KEY ("pOrCID")
);

-- CreateTable
CREATE TABLE "COrM" (
    "cOrMID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "pOrCID" INTEGER NOT NULL,

    CONSTRAINT "COrM_pkey" PRIMARY KEY ("cOrMID")
);

-- CreateTable
CREATE TABLE "Brgy" (
    "brgyID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,
    "cOrMID" INTEGER NOT NULL,

    CONSTRAINT "Brgy_pkey" PRIMARY KEY ("brgyID")
);

-- CreateTable
CREATE TABLE "Address" (
    "regionID" INTEGER NOT NULL,
    "pOrCID" INTEGER NOT NULL,
    "cOrMID" INTEGER NOT NULL,
    "brgyID" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "facilityID" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "Facility" (
    "facilityID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "openingTime" TIME(0),
    "closingTime" TIME(0),
    "facilityType" "FacilityType" NOT NULL,
    "ownership" "Ownership" NOT NULL,
    "bookingSystem" TEXT,
    "acceptedProviders" "Provider"[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "Division" (
    "divisionID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "openingTime" TIME(0) NOT NULL,
    "closingTime" TIME(0) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("divisionID")
);

-- CreateTable
CREATE TABLE "Employee" (
    "employeeID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "fname" TEXT NOT NULL,
    "mname" TEXT,
    "lname" TEXT NOT NULL,
    "photo" TEXT NOT NULL DEFAULT 'https://placehold.co/1080x1080/png',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeID")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceID" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "keywords" TEXT[],
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "AmbulanceService" (
    "phoneNumber" TEXT,
    "openingTime" TIME(0),
    "closingTime" TIME(0),
    "availability" "Availability" NOT NULL DEFAULT 'UNAVAILABLE',
    "baseRate" DOUBLE PRECISION NOT NULL,
    "minCoverageRadius" DOUBLE PRECISION NOT NULL,
    "mileageRate" DOUBLE PRECISION NOT NULL,
    "maxCoverageRadius" DOUBLE PRECISION NOT NULL,
    "serviceID" TEXT NOT NULL,

    CONSTRAINT "AmbulanceService_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "BloodTypeMapping" (
    "A_P" BOOLEAN NOT NULL DEFAULT false,
    "A_N" BOOLEAN NOT NULL DEFAULT false,
    "B_P" BOOLEAN NOT NULL DEFAULT false,
    "B_N" BOOLEAN NOT NULL DEFAULT false,
    "O_P" BOOLEAN NOT NULL DEFAULT false,
    "O_N" BOOLEAN NOT NULL DEFAULT false,
    "AB_P" BOOLEAN NOT NULL DEFAULT false,
    "AB_N" BOOLEAN NOT NULL DEFAULT false,
    "serviceID" TEXT NOT NULL,

    CONSTRAINT "BloodTypeMapping_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "BloodBankService" (
    "phoneNumber" TEXT,
    "openingTime" TIME(0),
    "closingTime" TIME(0),
    "basePricePerUnit" DOUBLE PRECISION NOT NULL,
    "turnaroundTimeD" INTEGER NOT NULL,
    "turnaroundTimeH" INTEGER NOT NULL,
    "serviceID" TEXT NOT NULL,

    CONSTRAINT "BloodBankService_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "ERService" (
    "phoneNumber" TEXT,
    "openingTime" TIME(0),
    "closingTime" TIME(0),
    "load" "Load" NOT NULL DEFAULT 'CLOSED',
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "nonUrgentPatients" INTEGER NOT NULL DEFAULT 0,
    "nonUrgentQueueLength" INTEGER NOT NULL DEFAULT 0,
    "urgentPatients" INTEGER NOT NULL DEFAULT 0,
    "urgentQueueLength" INTEGER NOT NULL DEFAULT 0,
    "criticalPatients" INTEGER NOT NULL DEFAULT 0,
    "criticalQueueLength" INTEGER NOT NULL DEFAULT 0,
    "serviceID" TEXT NOT NULL,

    CONSTRAINT "ERService_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "ICUService" (
    "phoneNumber" TEXT,
    "openingTime" TIME(0),
    "closingTime" TIME(0),
    "load" "Load" NOT NULL DEFAULT 'CLOSED',
    "baseRate" DOUBLE PRECISION NOT NULL,
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "cardiacSupport" BOOLEAN NOT NULL DEFAULT false,
    "neurologicalSupport" BOOLEAN NOT NULL DEFAULT false,
    "renalSupport" BOOLEAN NOT NULL DEFAULT false,
    "respiratorySupport" BOOLEAN NOT NULL DEFAULT false,
    "serviceID" TEXT NOT NULL,

    CONSTRAINT "ICUService_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "OutpatientService" (
    "basePrice" DOUBLE PRECISION NOT NULL,
    "completionTimeD" INTEGER NOT NULL,
    "completionTimeH" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "acceptsWalkIns" BOOLEAN NOT NULL,
    "serviceID" TEXT NOT NULL,

    CONSTRAINT "OutpatientService_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "UpdateLog" (
    "updateLogID" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "action" "Action" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,
    "employeeID" TEXT NOT NULL,

    CONSTRAINT "UpdateLog_pkey" PRIMARY KEY ("updateLogID")
);

-- CreateTable
CREATE TABLE "_DivisionToEmployee" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DivisionToEmployee_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "POrC_name_key" ON "POrC"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Address_regionID_pOrCID_cOrMID_brgyID_street_key" ON "Address"("regionID", "pOrCID", "cOrMID", "brgyID", "street");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_email_key" ON "Facility"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_phoneNumber_key" ON "Facility"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Division_email_key" ON "Division"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Division_phoneNumber_key" ON "Division"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Service_facilityID_type_key" ON "Service"("facilityID", "type");

-- CreateIndex
CREATE INDEX "_DivisionToEmployee_B_index" ON "_DivisionToEmployee"("B");

-- AddForeignKey
ALTER TABLE "POrC" ADD CONSTRAINT "POrC_regionID_fkey" FOREIGN KEY ("regionID") REFERENCES "Region"("regionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COrM" ADD CONSTRAINT "COrM_pOrCID_fkey" FOREIGN KEY ("pOrCID") REFERENCES "POrC"("pOrCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brgy" ADD CONSTRAINT "Brgy_cOrMID_fkey" FOREIGN KEY ("cOrMID") REFERENCES "COrM"("cOrMID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_regionID_fkey" FOREIGN KEY ("regionID") REFERENCES "Region"("regionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_pOrCID_fkey" FOREIGN KEY ("pOrCID") REFERENCES "POrC"("pOrCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cOrMID_fkey" FOREIGN KEY ("cOrMID") REFERENCES "COrM"("cOrMID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_brgyID_fkey" FOREIGN KEY ("brgyID") REFERENCES "Brgy"("brgyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceService" ADD CONSTRAINT "AmbulanceService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodTypeMapping" ADD CONSTRAINT "BloodTypeMapping_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "BloodBankService"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodBankService" ADD CONSTRAINT "BloodBankService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERService" ADD CONSTRAINT "ERService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ICUService" ADD CONSTRAINT "ICUService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutpatientService" ADD CONSTRAINT "OutpatientService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateLog" ADD CONSTRAINT "UpdateLog_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateLog" ADD CONSTRAINT "UpdateLog_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateLog" ADD CONSTRAINT "UpdateLog_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("employeeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DivisionToEmployee" ADD CONSTRAINT "_DivisionToEmployee_A_fkey" FOREIGN KEY ("A") REFERENCES "Division"("divisionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DivisionToEmployee" ADD CONSTRAINT "_DivisionToEmployee_B_fkey" FOREIGN KEY ("B") REFERENCES "Employee"("employeeID") ON DELETE CASCADE ON UPDATE CASCADE;
