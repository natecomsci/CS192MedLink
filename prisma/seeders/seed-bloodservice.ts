import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Blood Bank Services...");

  const facilityIDs = [
    "0eea8939-c386-46ad-95a2-12ae60740758",
    "1966fd91-fdf5-4ccb-9baf-fcc7a3522ae1",
    "5b21c862-2ab5-40c6-9455-d3f5d201a853",
    "6b03b270-26ed-4979-a303-f244c0404a78",
    "8d1e3817-2904-4bb8-9c80-4b3d73ee4c49",
  ];

  for (const facilityID of facilityIDs) {
    // Create BloodBankService
    await prisma.bloodBankService.create({
      data: {
        facilityID,
        phoneNumber: faker.phone.number(),
        openingTime: new Date("2024-01-01T08:00:00Z"), // Default 8:00 AM UTC
        closingTime: new Date("2024-01-01T22:00:00Z"), // Default 10:00 PM UTC
        pricePerUnit: faker.number.float({ min: 500, max: 3000, precision: 0.01 }),
        turnaroundTimeD: faker.number.int({ min: 0, max: 7 }), // 0-7 days
        turnaroundTimeH: faker.number.int({ min: 0, max: 23 }), // 0-23 hours
        divisionID: null, // Skipping division
      },
    });

    console.log(`✅ Seeded BloodBankService for Facility ${facilityID}`);

    // Create BloodTypeMapping (related to BloodBankService)
    await prisma.bloodTypeMapping.create({
      data: {
        facilityID,
        A_P: faker.datatype.boolean(),
        A_N: faker.datatype.boolean(),
        B_P: faker.datatype.boolean(),
        B_N: faker.datatype.boolean(),
        O_P: faker.datatype.boolean(),
        O_N: faker.datatype.boolean(),
        AB_P: faker.datatype.boolean(),
        AB_N: faker.datatype.boolean(),
      },
    });

    console.log(`✅ Seeded BloodTypeMapping for Facility ${facilityID}`);
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
