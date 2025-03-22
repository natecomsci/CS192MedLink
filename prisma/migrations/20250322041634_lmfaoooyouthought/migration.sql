/*
  Warnings:

  - You are about to drop the column `type` on the `UpdateLog` table. All the data in the column will be lost.
  - Added the required column `entity` to the `UpdateLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UpdateLog" DROP COLUMN "type",
ADD COLUMN     "divisionID" TEXT,
ADD COLUMN     "entity" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UpdateLog" ADD CONSTRAINT "UpdateLog_divisionID_fkey" FOREIGN KEY ("divisionID") REFERENCES "Division"("divisionID") ON DELETE CASCADE ON UPDATE CASCADE;
