-- DropForeignKey
ALTER TABLE "Division" DROP CONSTRAINT "Division_facilityID_fkey";

-- AddForeignKey
ALTER TABLE "Division" ADD CONSTRAINT "Division_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;
