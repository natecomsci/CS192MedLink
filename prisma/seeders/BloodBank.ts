import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { faker } from "@faker-js/faker";

import { seedSpecializedService } from "./seedersUtility";

export async function seedBloodBankService() {
  const bloodBankAttributes = () => ({
    basePricePerUnit : faker.number.float({ min: 500, max: 2000, fractionDigits: 2 }),
    turnaroundTimeD  : faker.number.int({ min: 0, max:  5 }),
    turnaroundTimeH  : faker.number.int({ min: 0, max: 23 }),

    bloodTypeAvailability: {
      create: {
        A_P  : faker.datatype.boolean(),
        A_N  : faker.datatype.boolean(),
        B_P  : faker.datatype.boolean(),
        B_N  : faker.datatype.boolean(),
        O_P  : faker.datatype.boolean(),
        O_N  : faker.datatype.boolean(),
        AB_P : faker.datatype.boolean(),
        AB_N : faker.datatype.boolean(),
      }
    }
  })

  await seedSpecializedService({
    model: prisma.bloodBankService,
    type: "Blood Bank",
    attributeGenerator: bloodBankAttributes,
  });
}