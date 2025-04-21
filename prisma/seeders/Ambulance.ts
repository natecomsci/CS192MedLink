import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { Availability } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { seedSpecializedService } from "./seedersUtility";

let availability: Availability[] = [Availability.AVAILABLE, Availability.UNAVAILABLE]

export async function seedAmbulanceService() {
  const ambulanceAttributes = () => ({
    baseRate          : faker.number.float({ min: 500, max: 2000, fractionDigits: 2 }),
    minCoverageRadius : faker.number.float({ min:   1, max:    5, fractionDigits: 2 }),
    mileageRate       : faker.number.float({ min:  10, max:   50, fractionDigits: 2 }),
    maxCoverageRadius : faker.number.float({ min:   5, max:   15, fractionDigits: 2 }),
    availability      : faker.helpers.arrayElement(availability),
  })

  await seedSpecializedService({
    model: prisma.ambulanceService,
    type: "Ambulance",
    attributeGenerator: ambulanceAttributes,
  });
}