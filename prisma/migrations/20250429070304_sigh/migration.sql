-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_employeeID_fkey";

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_employeeID_fkey" FOREIGN KEY ("employeeID") REFERENCES "Employee"("employeeID") ON DELETE CASCADE ON UPDATE CASCADE;
