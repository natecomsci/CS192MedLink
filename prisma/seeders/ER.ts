import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { faker } from "@faker-js/faker";

import { load, seedSpecializedService } from "./seedersUtility";

export async function seedERService() {
  const eRAttributes = () => ({
    load                 : faker.helpers.arrayElement(load),
    availableBeds        : faker.number.int({ min: 0, max: 20 }),
    nonUrgentPatients    : faker.number.int({ min: 0, max: 30 }),
    nonUrgentQueueLength : faker.number.int({ min: 0, max: 10 }),
    urgentPatients       : faker.number.int({ min: 0, max: 15 }),
    urgentQueueLength    : faker.number.int({ min: 0, max:  8 }),
    criticalPatients     : faker.number.int({ min: 0, max: 10 }),
    criticalQueueLength  : faker.number.int({ min: 0, max:  5 }),
  })

  await seedSpecializedService({
    model: prisma.eRService,
    type: "Emergency Room",
    attributeGenerator: eRAttributes,
  });
}