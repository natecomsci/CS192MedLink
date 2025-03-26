import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

export async function seedDivision() {
  const facilityIDs = ["paulwithdivisions", "2", "4"];

  for (const facilityID of facilityIDs) {
    const numDivisions = faker.number.int({ min: 2, max: 3 });

    for (let i = 0; i < numDivisions; i++) {
      await prisma.division.upsert({
        where: {
          divisionID: `${facilityID}-div-${i}`,
        },
        update: {},
        create: {
          divisionID  : `${facilityID}-div-${i}`,
          name        : `${faker.company.buzzNoun()} Division`,
          phoneNumber : faker.phone.number(),
          openingTime : faker.date.anytime(), // does not enforce constraints
          closingTime : faker.date.anytime(),
          facilityID,
        },
      });
    }
  }
}
