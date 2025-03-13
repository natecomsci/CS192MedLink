/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AmbulanceService` table. All the data in the column will be lost.
  - You are about to drop the column `divisionID` on the `AmbulanceService` table. All the data in the column will be lost.
  - You are about to drop the column `facilityID` on the `AmbulanceService` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AmbulanceService` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `BloodBankService` table. All the data in the column will be lost.
  - You are about to drop the column `divisionID` on the `BloodBankService` table. All the data in the column will be lost.
  - You are about to drop the column `facilityID` on the `BloodBankService` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BloodBankService` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ERService` table. All the data in the column will be lost.
  - You are about to drop the column `divisionID` on the `ERService` table. All the data in the column will be lost.
  - You are about to drop the column `facilityID` on the `ERService` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ERService` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ICUService` table. All the data in the column will be lost.
  - You are about to drop the column `divisionID` on the `ICUService` table. All the data in the column will be lost.
  - You are about to drop the column `facilityID` on the `ICUService` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ICUService` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OutpatientService` table. All the data in the column will be lost.
  - You are about to drop the column `divisionID` on the `OutpatientService` table. All the data in the column will be lost.
  - You are about to drop the column `facilityID` on the `OutpatientService` table. All the data in the column will be lost.
  - You are about to drop the column `serviceType` on the `OutpatientService` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `OutpatientService` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AmbulanceService" DROP CONSTRAINT "AmbulanceService_divisionID_fkey";

-- DropForeignKey
ALTER TABLE "AmbulanceService" DROP CONSTRAINT "AmbulanceService_facilityID_fkey";

-- DropForeignKey
ALTER TABLE "BloodBankService" DROP CONSTRAINT "BloodBankService_divisionID_fkey";

-- DropForeignKey
ALTER TABLE "BloodBankService" DROP CONSTRAINT "BloodBankService_facilityID_fkey";

-- DropForeignKey
ALTER TABLE "ERService" DROP CONSTRAINT "ERService_divisionID_fkey";

-- DropForeignKey
ALTER TABLE "ERService" DROP CONSTRAINT "ERService_facilityID_fkey";

-- DropForeignKey
ALTER TABLE "ICUService" DROP CONSTRAINT "ICUService_divisionID_fkey";

-- DropForeignKey
ALTER TABLE "ICUService" DROP CONSTRAINT "ICUService_facilityID_fkey";

-- DropForeignKey
ALTER TABLE "OutpatientService" DROP CONSTRAINT "OutpatientService_divisionID_fkey";

-- DropForeignKey
ALTER TABLE "OutpatientService" DROP CONSTRAINT "OutpatientService_facilityID_fkey";

-- DropIndex
DROP INDEX "AmbulanceService_divisionID_key";

-- DropIndex
DROP INDEX "AmbulanceService_facilityID_divisionID_key";

-- DropIndex
DROP INDEX "AmbulanceService_facilityID_key";

-- DropIndex
DROP INDEX "BloodBankService_divisionID_key";

-- DropIndex
DROP INDEX "BloodBankService_facilityID_divisionID_key";

-- DropIndex
DROP INDEX "BloodBankService_facilityID_key";

-- DropIndex
DROP INDEX "ERService_divisionID_key";

-- DropIndex
DROP INDEX "ERService_facilityID_divisionID_key";

-- DropIndex
DROP INDEX "ERService_facilityID_key";

-- DropIndex
DROP INDEX "ICUService_divisionID_key";

-- DropIndex
DROP INDEX "ICUService_facilityID_divisionID_key";

-- DropIndex
DROP INDEX "ICUService_facilityID_key";

-- DropIndex
DROP INDEX "OutpatientService_facilityID_serviceType_key";

-- AlterTable
ALTER TABLE "AmbulanceService" DROP COLUMN "createdAt",
DROP COLUMN "divisionID",
DROP COLUMN "facilityID",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "BloodBankService" DROP COLUMN "createdAt",
DROP COLUMN "divisionID",
DROP COLUMN "facilityID",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ERService" DROP COLUMN "createdAt",
DROP COLUMN "divisionID",
DROP COLUMN "facilityID",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ICUService" DROP COLUMN "createdAt",
DROP COLUMN "divisionID",
DROP COLUMN "facilityID",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "OutpatientService" DROP COLUMN "createdAt",
DROP COLUMN "divisionID",
DROP COLUMN "facilityID",
DROP COLUMN "serviceType",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "ServiceType";

-- CreateTable
CREATE TABLE "Service" (
    "serviceID" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "keywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "facilityID" TEXT NOT NULL,
    "divisionID" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_divisionID_key" ON "Service"("divisionID");

-- CreateIndex
CREATE UNIQUE INDEX "Service_facilityID_type_key" ON "Service"("facilityID", "type");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AmbulanceService" ADD CONSTRAINT "AmbulanceService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodBankService" ADD CONSTRAINT "BloodBankService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ERService" ADD CONSTRAINT "ERService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ICUService" ADD CONSTRAINT "ICUService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutpatientService" ADD CONSTRAINT "OutpatientService_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "Service"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;
