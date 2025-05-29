import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { faker } from "@faker-js/faker";

import { load, seedSpecializedService } from "./seedersUtility";

export async function seedICUService() {
  const iCUAttributes = () => ({
    load                : faker.helpers.arrayElement(load),
    baseRate            : faker.number.float({ min: 1000, max: 5000, fractionDigits: 2 }),
    availableBeds       : faker.number.int({ min: 0, max: 10 }),
    cardiacSupport      : faker.datatype.boolean(),
    neurologicalSupport : faker.datatype.boolean(),
    renalSupport        : faker.datatype.boolean(),
    respiratorySupport  : faker.datatype.boolean(),
  })

  await seedSpecializedService({
    model: prisma.iCUService,
    type: "Intensive Care Unit",
    attributeGenerator: iCUAttributes,
  });
}