import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Admins...");

  const facilityIDs = [
    "0eea8939-c386-46ad-95a2-12ae60740758",
    "1966fd91-fdf5-4ccb-9baf-fcc7a3522ae1",
    "5b21c862-2ab5-40c6-9455-d3f5d201a853",
    "6b03b270-26ed-4979-a303-f244c0404a78",
    "8d1e3817-2904-4bb8-9c80-4b3d73ee4c49",
  ];

  for (const facilityID of facilityIDs) {
    for (let i = 0; i < 2; i++) {
      const plainPassword = faker.internet.password(); // Generate a random password
      const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash password for security

      await prisma.admin.create({
        data: {
          facilityID,
          password: hashedPassword, // Store hashed password
          photo: "https://placehold.co/1080x1080/png", // Placeholder photo
        },
      });

      console.log(`✅ Seeded Admin ${i + 1} for Facility ${facilityID}`);
    }
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
