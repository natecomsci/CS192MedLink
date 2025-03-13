/*
  Warnings:

  - The primary key for the `AmbulanceService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BloodBankService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BloodTypeMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `facilityID` on the `BloodTypeMapping` table. All the data in the column will be lost.
  - The primary key for the `ERService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `COA` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `LTO` on the `Facility` table. All the data in the column will be lost.
  - The primary key for the `ICUService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OutpatientService` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[facilityID]` on the table `AmbulanceService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityID]` on the table `BloodBankService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityID]` on the table `ERService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityID]` on the table `ICUService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facilityID,serviceType]` on the table `OutpatientService` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - The required column `serviceID` was added to the `AmbulanceService` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `serviceID` was added to the `BloodBankService` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `serviceID` to the `BloodTypeMapping` table without a default value. This is not possible if the table is not empty.
  - The required column `serviceID` was added to the `ERService` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `updatedAt` to the `Facility` table without a default value. This is not possible if the table is not empty.
  - Made the column `photo` on table `Facility` required. This step will fail if there are existing NULL values in that column.
  - The required column `serviceID` was added to the `ICUService` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `serviceID` was added to the `OutpatientService` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "BloodTypeMapping" DROP CONSTRAINT "BloodTypeMapping_facilityID_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "fname" TEXT NOT NULL,
ADD COLUMN     "lname" TEXT NOT NULL,
ADD COLUMN     "mname" TEXT;

-- AlterTable
ALTER TABLE "AmbulanceService" DROP CONSTRAINT "AmbulanceService_pkey",
ADD COLUMN     "serviceID" TEXT NOT NULL,
ADD CONSTRAINT "AmbulanceService_pkey" PRIMARY KEY ("serviceID");

-- AlterTable
ALTER TABLE "BloodBankService" DROP CONSTRAINT "BloodBankService_pkey",
ADD COLUMN     "serviceID" TEXT NOT NULL,
ADD CONSTRAINT "BloodBankService_pkey" PRIMARY KEY ("serviceID");

-- AlterTable
ALTER TABLE "BloodTypeMapping" DROP CONSTRAINT "BloodTypeMapping_pkey",
DROP COLUMN "facilityID",
ADD COLUMN     "serviceID" TEXT NOT NULL,
ADD CONSTRAINT "BloodTypeMapping_pkey" PRIMARY KEY ("serviceID");

-- AlterTable
ALTER TABLE "ERService" DROP CONSTRAINT "ERService_pkey",
ADD COLUMN     "serviceID" TEXT NOT NULL,
ADD CONSTRAINT "ERService_pkey" PRIMARY KEY ("serviceID");

-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "COA",
DROP COLUMN "LTO",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "photo" SET NOT NULL;

-- AlterTable
ALTER TABLE "ICUService" DROP CONSTRAINT "ICUService_pkey",
ADD COLUMN     "serviceID" TEXT NOT NULL,
ADD CONSTRAINT "ICUService_pkey" PRIMARY KEY ("serviceID");

-- AlterTable
ALTER TABLE "OutpatientService" DROP CONSTRAINT "OutpatientService_pkey",
ADD COLUMN     "serviceID" TEXT NOT NULL,
ADD CONSTRAINT "OutpatientService_pkey" PRIMARY KEY ("serviceID");

-- CreateIndex
CREATE UNIQUE INDEX "AmbulanceService_facilityID_key" ON "AmbulanceService"("facilityID");

-- CreateIndex
CREATE UNIQUE INDEX "BloodBankService_facilityID_key" ON "BloodBankService"("facilityID");

-- CreateIndex
CREATE UNIQUE INDEX "ERService_facilityID_key" ON "ERService"("facilityID");

-- CreateIndex
CREATE UNIQUE INDEX "ICUService_facilityID_key" ON "ICUService"("facilityID");

-- CreateIndex
CREATE UNIQUE INDEX "OutpatientService_facilityID_serviceType_key" ON "OutpatientService"("facilityID", "serviceType");

-- AddForeignKey
ALTER TABLE "BloodTypeMapping" ADD CONSTRAINT "BloodTypeMapping_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "BloodBankService"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;
