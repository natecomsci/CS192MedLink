/*
  Warnings:

  - You are about to drop the column `mOrBID` on the `Address` table. All the data in the column will be lost.
  - The primary key for the `POrC` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `MOrB` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[regionID,pOrCID,cOrMID,brgyID,street]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[regionID]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brgyID` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cOrMID` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `regionID` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pOrCID` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pOrCID` on the `POrC` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regionID` on the `POrC` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `regionID` on the `Region` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_mOrBID_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_pOrCID_fkey";

-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_regionID_fkey";

-- DropForeignKey
ALTER TABLE "MOrB" DROP CONSTRAINT "MOrB_pOrCID_fkey";

-- DropForeignKey
ALTER TABLE "POrC" DROP CONSTRAINT "POrC_regionID_fkey";

-- DropIndex
DROP INDEX "Address_regionID_pOrCID_mOrBID_street_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "mOrBID",
ADD COLUMN     "brgyID" INTEGER NOT NULL,
ADD COLUMN     "cOrMID" INTEGER NOT NULL,
DROP COLUMN "regionID",
ADD COLUMN     "regionID" INTEGER NOT NULL,
DROP COLUMN "pOrCID",
ADD COLUMN     "pOrCID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "photo" SET DEFAULT 'https://placehold.co/1080x1080/png';

-- AlterTable
ALTER TABLE "Facility" ALTER COLUMN "photo" SET DEFAULT 'https://placehold.co/1920x1440/png',
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL,
ALTER COLUMN "LTO" DROP NOT NULL,
ALTER COLUMN "COA" DROP NOT NULL;

-- AlterTable
ALTER TABLE "POrC" DROP CONSTRAINT "POrC_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "pOrCID",
ADD COLUMN     "pOrCID" INTEGER NOT NULL,
DROP COLUMN "regionID",
ADD COLUMN     "regionID" INTEGER NOT NULL,
ADD CONSTRAINT "POrC_pkey" PRIMARY KEY ("pOrCID");

-- AlterTable
ALTER TABLE "Region" DROP CONSTRAINT "Region_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "regionID",
ADD COLUMN     "regionID" INTEGER NOT NULL,
ADD CONSTRAINT "Region_pkey" PRIMARY KEY ("regionID");

-- DropTable
DROP TABLE "MOrB";

-- CreateTable
CREATE TABLE "COrM" (
    "id" SERIAL NOT NULL,
    "cOrMID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "pOrCID" INTEGER NOT NULL,

    CONSTRAINT "COrM_pkey" PRIMARY KEY ("cOrMID")
);

-- CreateTable
CREATE TABLE "Brgy" (
    "id" SERIAL NOT NULL,
    "brgyID" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cOrMID" INTEGER NOT NULL,

    CONSTRAINT "Brgy_pkey" PRIMARY KEY ("brgyID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_regionID_pOrCID_cOrMID_brgyID_street_key" ON "Address"("regionID", "pOrCID", "cOrMID", "brgyID", "street");

-- CreateIndex
CREATE UNIQUE INDEX "Region_regionID_key" ON "Region"("regionID");

-- AddForeignKey
ALTER TABLE "POrC" ADD CONSTRAINT "POrC_regionID_fkey" FOREIGN KEY ("regionID") REFERENCES "Region"("regionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COrM" ADD CONSTRAINT "COrM_pOrCID_fkey" FOREIGN KEY ("pOrCID") REFERENCES "POrC"("pOrCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brgy" ADD CONSTRAINT "Brgy_cOrMID_fkey" FOREIGN KEY ("cOrMID") REFERENCES "COrM"("cOrMID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_brgyID_fkey" FOREIGN KEY ("brgyID") REFERENCES "Brgy"("brgyID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_cOrMID_fkey" FOREIGN KEY ("cOrMID") REFERENCES "COrM"("cOrMID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_pOrCID_fkey" FOREIGN KEY ("pOrCID") REFERENCES "POrC"("pOrCID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_regionID_fkey" FOREIGN KEY ("regionID") REFERENCES "Region"("regionID") ON DELETE RESTRICT ON UPDATE CASCADE;
