import { PrismaClient } from "@prisma/client"

import { seedFacility } from "./FacilityAddressManager"
import { seedDivision } from "./Division"
import { seedAdmin } from "./Admin"
import { seedAmbulanceService } from "./Ambulance"
import { seedBloodBankService } from "./BloodBank"
import { seedERService } from "./ER"
import { seedICUService } from "./ICU"
import { seedOutpatientService } from "./Outpatient"

const prisma = new PrismaClient()

async function main() {
  await seedFacility();
  await seedDivision();
  await seedAdmin();
  await seedAmbulanceService();
  await seedBloodBankService();
  await seedERService();
  await seedICUService();
  await seedOutpatientService();
}

main()
.then(
async ( ) => {
  await prisma.$disconnect()
})
.catch(
  async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})