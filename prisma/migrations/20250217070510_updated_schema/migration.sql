/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adminId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - The required column `adminID` was added to the `Admin` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `facilityID` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('INTELLICARE', 'ASIACARE', 'AVEGA', 'CAREWELL', 'one_COOPHEALTH', 'DYNAMIC_CARE_CORPORATION', 'EASTWEST_HEALTHCARE', 'FORTICARE', 'GETWELL', 'HC_and_D', 'HEALTHFIRST', 'HMI', 'HPPI', 'IWC', 'ICARE', 'KAISER', 'LIFE_and_HEALTH', 'MAXICARE', 'MEDICARD', 'MEDICARE', 'MEDOCARE', 'METROCARE', 'OMHSI', 'PACIFIC_CROSS', 'PHILHEALTH', 'VALUCARE', 'WELLCARE');

-- CreateEnum
CREATE TYPE "SecurityQuestion" AS ENUM ('STREETNAME', 'FIRSTFRIENDNICKNAME', 'FAVORITEOUTDOORGAME', 'FIRSTPETNAME', 'INFLUENTIALTEACHER', 'FAVORITETVSHOW', 'FAVORITEULAM', 'UNUSUALSTREETFOOD', 'FIRSTJOB', 'MEMORABLEBIRTHDAYGIFT');

-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('BARANGAY_HEALTH_CENTER', 'CLINIC', 'HEALTH_CENTER', 'HOSPITAL', 'INFIRMARY', 'POLYCLINIC', 'PRIMARY_CARE_CLINIC', 'CARDIOLOGY_CLINIC', 'DENTAL_CLINIC', 'DERMATOLOGY_CLINIC', 'ENDOCRINOLOGY_CLINIC', 'ENT_CLINIC', 'FERTILITY_CLINIC', 'GASTROENTEROLOGY_CLINIC', 'IMMUNOLOGY_CENTER', 'INFECTIOUS_DISEASE_CENTER', 'MATERNITY_CENTER', 'NEPHROLOGY_CLINIC', 'NEUROLOGY_CLINIC', 'ONCOLOGY_CENTER', 'OPHTHALMOLOGY_CLINIC', 'ORTHOPEDIC_CLINIC', 'PEDIATRIC_CLINIC', 'PULMONOLOGY_CLINIC', 'RHEUMATOLOGY_CLINIC', 'UROLOGY_CLINIC', 'DIAGNOSTIC_LAB', 'GENETIC_TESTING_LAB', 'PATHOLOGY_LAB', 'RADIOLOGY_CENTER', 'BURN_CENTER', 'CRITICAL_CARE_CENTER', 'EMERGENCY_CENTER', 'POISON_CONTROL_CENTER', 'TRAUMA_CENTER', 'URGENT_CARE_CENTER', 'BLOOD_BANK', 'DIALYSIS_CENTER', 'MENTAL_HEALTH_FACILITY', 'PAIN_MANAGEMENT_CLINIC', 'REHABILITATION_CENTER', 'SLEEP_CENTER', 'SUBSTANCE_ABUSE_CENTER', 'TRANSPLANT_CENTER', 'ALTERNATIVE_MEDICINE_CENTER', 'HERBAL_MEDICINE_CENTER', 'PHYSICAL_THERAPY_CENTER', 'AMBULATORY_CARE_CENTER', 'SURGICAL_CENTER', 'AMBULANCE_SERVICE');

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'SHORT_DELAY', 'MODERATE_DELAY', 'EXTENDED_DELAY', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "Load" AS ENUM ('STEADY', 'MODERATE', 'CROWDED', 'NEAR_CAPACITY', 'FULL_CAPACITY', 'CLOSED');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CONSULTATION_GENERAL', 'CONSULTATION_CARDIOLOGY', 'CONSULTATION_DERMATOLOGY', 'CONSULTATION_ENDOCRINOLOGY', 'CONSULTATION_ENT', 'CONSULTATION_GASTROENTEROLOGY', 'CONSULTATION_NEUROLOGY', 'CONSULTATION_OB_GYNE', 'CONSULTATION_ONCOLOGY', 'CONSULTATION_OPHTHALMOLOGY', 'CONSULTATION_ORTHOPEDICS', 'CONSULTATION_PEDIATRICS', 'CONSULTATION_PSYCHIATRY', 'CONSULTATION_PULMONOLOGY', 'CONSULTATION_REHABILITATION', 'CONSULTATION_RHEUMATOLOGY', 'CONSULTATION_UROLOGY', 'BLOOD_CHEMISTRY_BUA', 'BLOOD_CHEMISTRY_BUN', 'BLOOD_CHEMISTRY_CREATININE', 'BLOOD_CHEMISTRY_FBS', 'BLOOD_CHEMISTRY_RBS', 'BLOOD_CHEMISTRY_CHOLESTEROL', 'BLOOD_CHEMISTRY_TRIGLYCERIDES', 'BLOOD_CHEMISTRY_HDL', 'BLOOD_CHEMISTRY_LDL', 'BLOOD_CHEMISTRY_AST', 'BLOOD_CHEMISTRY_ALT', 'BLOOD_CHEMISTRY_LDH', 'BLOOD_CHEMISTRY_ELECTROLYTES', 'HEMATOLOGY_CBC', 'HEMATOLOGY_HEMOGLOBIN', 'HEMATOLOGY_HEMATOCRIT', 'HEMATOLOGY_PLATELET_COUNT', 'HEMATOLOGY_COAGULATION', 'HEMATOLOGY_CT_BT', 'HEMATOLOGY_PERIPHERAL_SMEAR', 'CLINICAL_FECALYSIS', 'CLINICAL_URINALYSIS', 'CLINICAL_OCCULT_BLOOD', 'CLINICAL_SEMEN_ANALYSIS', 'CLINICAL_BODY_FLUID_ANALYSIS', 'CLINICAL_PREGNANCY_TEST', 'BACTERIOLOGY_SPUTUM', 'BACTERIOLOGY_GRAM_STAIN', 'BACTERIOLOGY_CULTURE_SENS', 'BACTERIOLOGY_THROAT_SWAB', 'BACTERIOLOGY_BLOOD_CULTURE', 'BACTERIOLOGY_URINE_CULTURE', 'HISTOPATHOLOGY_PAPS', 'HISTOPATHOLOGY_BIOPSY', 'HISTOPATHOLOGY_CYTOLOGY', 'X_RAY_CHEST_PA', 'X_RAY_CHEST_AP_LAT', 'X_RAY_SKULL_AP_LAT', 'X_RAY_C_SPINE', 'X_RAY_L_SPINE', 'X_RAY_THORACIC_CAGE', 'X_RAY_SHOULDER', 'X_RAY_CLAVICLE', 'X_RAY_ARM_AP_LAT', 'X_RAY_HAND', 'X_RAY_FOOT', 'ULTRASOUND_ABDOMINAL', 'ULTRASOUND_WHOLE_ABD', 'ULTRASOUND_PELVIC', 'ULTRASOUND_TRANSVAGINAL', 'ULTRASOUND_THYROID', 'ULTRASOUND_BREAST', 'ULTRASOUND_KUB', 'ULTRASOUND_OB', 'ULTRASOUND_OB_NO_READING', 'ULTRASOUND_DOPPLER', 'ULTRASOUND_SCROTAL', 'ULTRASOUND_PROSTATE', 'CT_SCAN_HEAD', 'CT_SCAN_BRAIN_STROKE', 'CT_SCAN_SINUSES', 'CT_SCAN_ANGIOGRAM_HEAD', 'CT_SCAN_ANGIOGRAM_NECK', 'CT_SCAN_CHEST', 'CT_SCAN_CHEST_HRCT', 'CT_SCAN_CHEST_PULMO_EMB', 'CT_SCAN_ANGIOGRAM_CORONARY', 'CT_SCAN_ABD', 'CT_SCAN_ABD_PELVIS', 'CT_SCAN_KUB', 'CT_SCAN_ANGIOGRAM_ABD', 'CT_SCAN_C_SPINE', 'CT_SCAN_T_SPINE', 'CT_SCAN_L_SPINE', 'CT_SCAN_JOINT', 'MRI_BRAIN', 'MRI_C_SPINE', 'MRI_T_SPINE', 'MRI_L_SPINE', 'MAMMOGRAPHY_BILATERAL', 'MAMMOGRAPHY_UNILATERAL', 'OPTICAL_REFRACTION', 'OPTICAL_TONOMETRY', 'OPTICAL_CHALAZION_REMOVAL', 'OPTICAL_FOREIGN_BODY_REMOVAL', 'OPTICAL_OCT_OPTIC_NERVE', 'OPTICAL_OCT_MACULA', 'HEARING_AUDIOMETRY', 'HEARING_TYMPANOMETRY', 'ENT_EAR_IRRIGATION', 'ENT_EAR_WAX_REMOVAL', 'ENT_NASAL_ENDOSCOPY', 'ENT_LARYNGOSCOPY', 'ENT_VIDEOSTROBOSCOPY', 'DENTAL_EXTRACTION', 'DENTAL_SCALING', 'DENTAL_FILLING_TEMPORARY', 'DENTAL_FILLING_PERMANENT', 'DENTAL_ROOT_CANAL', 'DENTAL_CROWN_PLACEMENT', 'DENTAL_BRIDGE_PLACEMENT', 'DENTAL_WHITENING', 'THERAPY_PHYSICAL', 'THERAPY_OCCUPATIONAL', 'THERAPY_SPEECH', 'THERAPY_RESPIRATORY', 'THERAPY_VESTIBULAR', 'THERAPY_CARDIAC', 'THERAPY_LYMPHEDEMA', 'THERAPY_NEUROLOGICAL', 'ONCOLOGY_CHEMOTHERAPY', 'ONCOLOGY_RADIATION_THERAPY', 'ONCOLOGY_PALLIATIVE_CARE', 'ONCOLOGY_HORMONAL_THERAPY', 'ONCOLOGY_IMMUNOTHERAPY', 'ONCOLOGY_TARGETED_THERAPY', 'PROCEDURE_CAUTERIZATION', 'PROCEDURE_CIRCUMCISION', 'PROCEDURE_DEBRIDEMENT', 'PROCEDURE_DRESSING', 'PROCEDURE_EAR_PIERCING', 'PROCEDURE_INCISION', 'PROCEDURE_DRAINAGE', 'PROCEDURE_WOUND_SUTURING', 'PROCEDURE_WOUND_SUTURE_REMOVAL', 'PROCEDURE_CYST_REMOVAL', 'PROCEDURE_LIPOMA_REMOVAL', 'PROCEDURE_SKIN_TAG_REMOVAL', 'PROCEDURE_NAIL_REMOVAL', 'PROCEDURE_WART_REMOVAL', 'PROCEDURE_BIOPSY', 'PROCEDURE_EEG', 'PROCEDURE_ECG', 'PROCEDURE_PFT', 'PROCEDURE_DIALYSIS', 'PROCEDURE_LUMBAR_TAP', 'PROCEDURE_PARACENTESIS', 'PROCEDURE_UMBILICAL_CATH', 'PROCEDURE_COLONOSCOPY', 'PROCEDURE_GASTROSCOPY', 'PROCEDURE_BRONCHOSCOPY', 'PROCEDURE_THORACENTESIS', 'PROCEDURE_LABOR_DELIVERY', 'VACCINATION_HEPATITIS_A', 'VACCINATION_HEPATITIS_B', 'VACCINATION_HPV', 'VACCINATION_INFLUENZA', 'VACCINATION_MMR', 'VACCINATION_POLIO', 'VACCINATION_RABIES', 'VACCINATION_COVID19', 'VACCINATION_ROTAVIRUS', 'VACCINATION_PNEUMOCOCCAL', 'VACCINATION_MENINGOCOCCAL', 'VACCINATION_TDAP');

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "adminId",
DROP COLUMN "name",
ADD COLUMN     "adminID" TEXT NOT NULL,
ADD COLUMN     "facilityID" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminID");

-- DropTable
DROP TABLE "Manager";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Credentials" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "patientID" TEXT NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "patientID" TEXT NOT NULL,
    "securityQuestion" "SecurityQuestion" NOT NULL,
    "providers" "Provider"[],

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patientID")
);

-- CreateTable
CREATE TABLE "Region" (
    "regionID" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("regionID")
);

-- CreateTable
CREATE TABLE "POrC" (
    "pOrCID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionID" TEXT NOT NULL,

    CONSTRAINT "POrC_pkey" PRIMARY KEY ("pOrCID")
);

-- CreateTable
CREATE TABLE "MOrB" (
    "mOrBID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pOrCID" TEXT NOT NULL,

    CONSTRAINT "MOrB_pkey" PRIMARY KEY ("mOrBID")
);

-- CreateTable
CREATE TABLE "Address" (
    "addressID" TEXT NOT NULL,
    "regionID" TEXT NOT NULL,
    "pOrCID" TEXT NOT NULL,
    "mOrBID" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "facilityID" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("addressID")
);

-- CreateTable
CREATE TABLE "Facility" (
    "facilityID" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "facilityType" "FacilityType" NOT NULL,
    "ownership" "Ownership" NOT NULL,
    "LTO" TEXT NOT NULL,
    "COA" TEXT NOT NULL,
    "bookingSystem" TEXT,
    "acceptedProviders" "Provider"[],

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "Division" (
    "divisionID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "openingTime" TIME(0) NOT NULL,
    "closingTime" TIME(0) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,

    CONSTRAINT "Division_pkey" PRIMARY KEY ("divisionID")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientID" TEXT NOT NULL,
    "facilityID" TEXT NOT NULL,
    "folderID" TEXT,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("patientID","facilityID")
);

-- CreateTable
CREATE TABLE "Folder" (
    "folderID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientID" TEXT NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("folderID")
);

-- CreateTable
CREATE TABLE "AmbulanceService" (
    "phoneNumber" TEXT NOT NULL,
    "openingTime" TIME(0) NOT NULL,
    "closingTime" TIME(0) NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "minCoverageRadius" DOUBLE PRECISION NOT NULL,
    "mileageRate" DOUBLE PRECISION NOT NULL,
    "maxCoverageRadius" DOUBLE PRECISION NOT NULL,
    "availability" "Availability" NOT NULL DEFAULT 'UNAVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "AmbulanceService_pkey" PRIMARY KEY ("facilityID")
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
    "facilityID" TEXT NOT NULL,

    CONSTRAINT "BloodTypeMapping_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "BloodBankService" (
    "phoneNumber" TEXT NOT NULL,
    "openingTime" TIME(0) NOT NULL,
    "closingTime" TIME(0) NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "turnaroundTimeD" INTEGER NOT NULL,
    "turnaroundTimeH" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "BloodBankService_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "ERService" (
    "phoneNumber" TEXT NOT NULL,
    "load" "Load" NOT NULL DEFAULT 'CLOSED',
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "nonUrgentPatients" INTEGER NOT NULL DEFAULT 0,
    "nonUrgentQueueLength" INTEGER NOT NULL DEFAULT 0,
    "urgentPatients" INTEGER NOT NULL DEFAULT 0,
    "urgentQueueLength" INTEGER NOT NULL DEFAULT 0,
    "criticalPatients" INTEGER NOT NULL DEFAULT 0,
    "criticalQueueLength" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "ERService_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "ICUService" (
    "phoneNumber" TEXT NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "load" "Load" NOT NULL,
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "cardiacSupport" BOOLEAN NOT NULL DEFAULT false,
    "neurologicalSupport" BOOLEAN NOT NULL DEFAULT false,
    "renalSupport" BOOLEAN NOT NULL DEFAULT false,
    "respiratorySupport" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "ICUService_pkey" PRIMARY KEY ("facilityID")
);

-- CreateTable
CREATE TABLE "OutpatientService" (
    "serviceType" "ServiceType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "completionTimeD" INTEGER NOT NULL,
    "completionTimeH" INTEGER NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "acceptsWalkIns" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "OutpatientService_pkey" PRIMARY KEY ("facilityID","serviceType")
);

-- CreateTable
CREATE TABLE "_AdminToDivision" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AdminToDivision_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_patientID_key" ON "Credentials"("patientID");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_key" ON "Region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "POrC_name_key" ON "POrC"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MOrB_name_key" ON "MOrB"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Address_facilityID_key" ON "Address"("facilityID");

-- CreateIndex
CREATE UNIQUE INDEX "Address_regionID_pOrCID_mOrBID_street_key" ON "Address"("regionID", "pOrCID", "mOrBID", "street");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_email_key" ON "Facility"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_phoneNumber_key" ON "Facility"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_patientID_name_key" ON "Folder"("patientID", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AmbulanceService_divisionID_key" ON "AmbulanceService"("divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "AmbulanceService_facilityID_divisionID_key" ON "AmbulanceService"("facilityID", "divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "BloodBankService_divisionID_key" ON "BloodBankService"("divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "BloodBankService_facilityID_divisionID_key" ON "BloodBankService"("facilityID", "divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "ERService_divisionID_key" ON "ERService"("divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "ERService_facilityID_divisionID_key" ON "ERService"("facilityID", "divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "ICUService_divisionID_key" ON "ICUService"("divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "ICUService_facilityID_divisionID_key" ON "ICUService"("facilityID", "divisionID");

-- CreateIndex
CREATE INDEX "_AdminToDivision_B_index" ON "_AdminToDivision"("B");

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POrC" ADD CONSTRAINT "POrC_regionID_fkey" FOREIGN KEY ("regionID") REFERENCES "Region"("regionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MOrB" ADD CONSTRAINT "MOrB_pOrCID_fkey" FOREIGN KEY ("pOrCID") REFERENCES "POrC"("pOrCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_regionID_fkey" FOREIGN KEY ("regionID") REFERENCES "Region"("regionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_pOrCID_fkey" FOREIGN KEY ("pOrCID") REFERENCES "POrC"("pOrCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_mOrBID_fkey" FOREIGN KEY ("mOrBID") REFERENCES "MOrB"("mOrBID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_folderID_fkey" FOREIGN KEY ("folderID") REFERENCES "Folder"("folderID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_patientID_fkey" FOREIGN KEY ("patientID") REFERENCES "Patient"("patientID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceService" ADD CONSTRAINT "AmbulanceService_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceService" ADD CONSTRAINT "AmbulanceService_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodTypeMapping" ADD CONSTRAINT "BloodTypeMapping_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "BloodBankService"("facilityID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodBankService" ADD CONSTRAINT "BloodBankService_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodBankService" ADD CONSTRAINT "BloodBankService_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERService" ADD CONSTRAINT "ERService_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERService" ADD CONSTRAINT "ERService_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ICUService" ADD CONSTRAINT "ICUService_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ICUService" ADD CONSTRAINT "ICUService_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutpatientService" ADD CONSTRAINT "OutpatientService_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutpatientService" ADD CONSTRAINT "OutpatientService_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToDivision" ADD CONSTRAINT "_AdminToDivision_A_fkey" FOREIGN KEY ("A") REFERENCES "Admin"("adminID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AdminToDivision" ADD CONSTRAINT "_AdminToDivision_B_fkey" FOREIGN KEY ("B") REFERENCES "Division"("divisionID") ON DELETE CASCADE ON UPDATE CASCADE;
