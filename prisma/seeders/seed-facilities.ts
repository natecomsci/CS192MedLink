import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Facilities...");

  const facilityIDs = [
    "0eea8939-c386-46ad-95a2-12ae60740758",
    "1966fd91-fdf5-4ccb-9baf-fcc7a3522ae1",
    "5b21c862-2ab5-40c6-9455-d3f5d201a853",
    "6b03b270-26ed-4979-a303-f244c0404a78",
    "8d1e3817-2904-4bb8-9c80-4b3d73ee4c49",
  ];

  for (const facilityID of facilityIDs) {
    await prisma.facility.create({
      data: {
        facilityID, // Hardcoded ID
        password: faker.internet.password(),
        name: faker.company.name(),
        photo: "https://placehold.co/1920x1440/png",
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        facilityType: "HOSPITAL", // Modify as needed
        ownership: "PRIVATE", // Modify as needed
        LTO: faker.string.alphanumeric(10),
        COA: faker.string.alphanumeric(10),
        bookingSystem: faker.helpers.arrayElement(["Yes", "No", null]),
      },
    });

    console.log(`Created Facility with ID: ${facilityID}`);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
