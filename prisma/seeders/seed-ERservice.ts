import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ER Services...");

  const facilityIDs = [
    "0eea8939-c386-46ad-95a2-12ae60740758",
    "1966fd91-fdf5-4ccb-9baf-fcc7a3522ae1",
    "5b21c862-2ab5-40c6-9455-d3f5d201a853",
    "6b03b270-26ed-4979-a303-f244c0404a78",
    "8d1e3817-2904-4bb8-9c80-4b3d73ee4c49",
  ];

  const loadLevels = [
    "STEADY",
    "MODERATE",
    "CROWDED",
    "NEAR_CAPACITY",
    "FULL_CAPACITY",
    "CLOSED",
  ];

  for (const facilityID of facilityIDs) {
    // Create ERService
    await prisma.eRService.create({
      data: {
        facilityID,
        phoneNumber: faker.phone.number(),
        load: loadLevels[Math.floor(Math.random() * loadLevels.length)] as any, // Random load status
        availableBeds: faker.number.int({ min: 0, max: 50 }), // Random bed count
        nonUrgentPatients: faker.number.int({ min: 0, max: 20 }),
        nonUrgentQueueLength: faker.number.int({ min: 0, max: 10 }),
        urgentPatients: faker.number.int({ min: 0, max: 20 }),
        urgentQueueLength: faker.number.int({ min: 0, max: 10 }),
        criticalPatients: faker.number.int({ min: 0, max: 10 }),
        criticalQueueLength: faker.number.int({ min: 0, max: 5 }),
        divisionID: null, // Skipping division
      },
    });

    console.log(`✅ Seeded ERService for Facility ${facilityID}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
