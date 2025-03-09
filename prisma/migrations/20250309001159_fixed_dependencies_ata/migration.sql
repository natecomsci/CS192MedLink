-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_facilityID_fkey";

-- DropForeignKey
ALTER TABLE "BloodTypeMapping" DROP CONSTRAINT "BloodTypeMapping_serviceID_fkey";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_facilityID_fkey" FOREIGN KEY ("facilityID") REFERENCES "Facility"("facilityID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodTypeMapping" ADD CONSTRAINT "BloodTypeMapping_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "BloodBankService"("serviceID") ON DELETE CASCADE ON UPDATE CASCADE;
