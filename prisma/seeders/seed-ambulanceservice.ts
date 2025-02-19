import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Ambulance Services...");

  const facilityIDs = [
    "0eea8939-c386-46ad-95a2-12ae60740758",
    "1966fd91-fdf5-4ccb-9baf-fcc7a3522ae1",
    "5b21c862-2ab5-40c6-9455-d3f5d201a853",
    "6b03b270-26ed-4979-a303-f244c0404a78",
    "8d1e3817-2904-4bb8-9c80-4b3d73ee4c49",
  ];

  for (const facilityID of facilityIDs) {
    await prisma.ambulanceService.create({
      data: {
        facilityID,
        phoneNumber: faker.phone.number(),
        openingTime: new Date("2024-01-01T08:00:00Z"), // Default to 8:00 AM UTC
        closingTime: new Date("2024-01-01T22:00:00Z"), // Default to 10:00 PM UTC
        baseRate: faker.number.float({ min: 500, max: 2000, precision: 0.01 }),
        minCoverageRadius: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
        mileageRate: faker.number.float({ min: 10, max: 50, precision: 0.1 }),
        maxCoverageRadius: faker.number.float({ min: 20, max: 100, precision: 1 }),
        availability: "UNAVAILABLE", // Default availability
        divisionID: null, // Skipping division
      },
    });

    console.log(`✅ Seeded AmbulanceService for Facility ${facilityID}`);
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
