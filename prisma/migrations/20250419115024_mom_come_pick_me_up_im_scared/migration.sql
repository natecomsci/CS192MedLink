/*
  Warnings:

  - The values [IMMUNOLOGY_CENTER,INFECTIOUS_DISEASE_CENTER,MATERNITY_CENTER,ONCOLOGY_CENTER,MENTAL_HEALTH_FACILITY,PAIN_MANAGEMENT_CLINIC,HERBAL_MEDICINE_CENTER] on the enum `FacilityType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `phoneNumber` on the `AmbulanceService` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `BloodBankService` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Division` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ERService` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ICUService` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('PHONE', 'EMAIL');

-- AlterEnum
BEGIN;
CREATE TYPE "FacilityType_new" AS ENUM ('BARANGAY_HEALTH_CENTER', 'CLINIC', 'HEALTH_CENTER', 'HOSPITAL', 'INFIRMARY', 'POLYCLINIC', 'PRIMARY_CARE_CLINIC', 'ALLERGY_CLINIC', 'CARDIOLOGY_CLINIC', 'DENTAL_CLINIC', 'DERMATOLOGY_CLINIC', 'ENDOCRINOLOGY_CLINIC', 'ENT_CLINIC', 'FERTILITY_CLINIC', 'GASTROENTEROLOGY_CLINIC', 'IMMUNOLOGY_CLINIC', 'INFECTIOUS_DISEASE_CLINIC', 'MATERNITY_CLINIC', 'NEPHROLOGY_CLINIC', 'NEUROLOGY_CLINIC', 'ONCOLOGY_CLINIC', 'OPHTHALMOLOGY_CLINIC', 'ORTHOPEDIC_CLINIC', 'PEDIATRIC_CLINIC', 'PULMONOLOGY_CLINIC', 'RHEUMATOLOGY_CLINIC', 'UROLOGY_CLINIC', 'DIAGNOSTIC_LAB', 'GENETIC_TESTING_LAB', 'PATHOLOGY_LAB', 'RADIOLOGY_CENTER', 'MICROBIOLOGY_LAB', 'TOXICOLOGY_LAB', 'BURN_CENTER', 'CRITICAL_CARE_CENTER', 'EMERGENCY_CENTER', 'POISON_CONTROL_CENTER', 'TRAUMA_CENTER', 'URGENT_CARE_CENTER', 'BLOOD_BANK', 'DIALYSIS_CENTER', 'MENTAL_HEALTH_CENTER', 'PAIN_MANAGEMENT_CENTER', 'REHABILITATION_CENTER', 'SLEEP_CENTER', 'SUBSTANCE_ABUSE_CENTER', 'TRANSPLANT_CENTER', 'ALTERNATIVE_MEDICINE_CENTER', 'PHYSICAL_THERAPY_CENTER', 'OCCUPATIONAL_THERAPY_CENTER', 'SPEECH_THERAPY_CENTER', 'AMBULATORY_CARE_CENTER', 'SURGICAL_CENTER', 'AMBULANCE_SERVICE');
ALTER TABLE "Facility" ALTER COLUMN "facilityType" TYPE "FacilityType_new" USING ("facilityType"::text::"FacilityType_new");
ALTER TYPE "FacilityType" RENAME TO "FacilityType_old";
ALTER TYPE "FacilityType_new" RENAME TO "FacilityType";
DROP TYPE "FacilityType_old";
COMMIT;

-- DropIndex
DROP INDEX "Division_email_key";

-- DropIndex
DROP INDEX "Division_phoneNumber_key";

-- DropIndex
DROP INDEX "Facility_email_key";

-- DropIndex
DROP INDEX "Facility_phoneNumber_key";

-- AlterTable
ALTER TABLE "AmbulanceService" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "BloodBankService" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "Division" DROP COLUMN "email",
DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "ERService" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "email",
DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "ICUService" DROP COLUMN "phoneNumber";

-- CreateTable
CREATE TABLE "Session" (
    "sessionID" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "employeeID" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionID")
);

-- CreateTable
CREATE TABLE "Contact" (
    "contactID" TEXT NOT NULL,
    "info" TEXT NOT NULL,
    "type" "ContactType" NOT NULL,
    "facilityID" TEXT,
    "divisionID" TEXT,
    "serviceID" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contactID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_info_key" ON "Contact"("info");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("employeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;
