import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { seedFacility } from "./Facility";
import { seedManager } from "./Manager";
import { seedAddress } from "./Address";
import { seedDivision } from "./Division";
import { seedAdmin } from "./Admin";
import { seedAmbulanceService } from "./Ambulance";
import { seedBloodBankService } from "./BloodBank";
import { seedERService } from "./ER";
import { seedICUService } from "./ICU";
import { seedOutpatientService } from "./Outpatient";
import { seedContact } from "./Contact";

async function main() {
  await seedFacility();
  await seedManager();
  await seedAddress();
  await seedDivision();
  await seedAdmin();
  await seedAmbulanceService();
  await seedBloodBankService();
  await seedERService();
  await seedICUService();
  await seedOutpatientService();
  await seedContact();
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