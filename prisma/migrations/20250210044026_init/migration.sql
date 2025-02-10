/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "userId" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- CreateTable
CREATE TABLE "Manager" (
    "hospitalId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("hospitalId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manager_name_key" ON "Manager"("name");
