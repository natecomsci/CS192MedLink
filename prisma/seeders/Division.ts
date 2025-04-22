import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { Action } from "@prisma/client";

import { updateLogDAO, createOperatingHours, getFacilities } from "./seedersUtility";

import { faker } from "@faker-js/faker";

function getUniqueDivisionName(usedNames: Set<string>): string {
  let name: string;

  do {
    const raw = faker.company.name();
    name = raw
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } while (usedNames.has(name));

  usedNames.add(name);

  return name;
}

export async function seedDivision() {
  const facilities: {
    facilityID: string;
    employeeID: string;
  }[] = await getFacilities(true);

  for (const { facilityID, employeeID } of facilities) {
    if (!employeeID) {
      console.warn(`No Manager found for facility ${facilityID}. Skipping seeding.`);

      continue;
    }

    const numDivisions: number = faker.number.int({ min: 2, max: 5 });

    const usedNames: Set<string> = new Set<string>();

    for (let i = 0; i < numDivisions; i++) {
      const { openingTime, closingTime } = createOperatingHours();

      const name: string = `${getUniqueDivisionName(usedNames)} Division`;

      const divisionID: string = `${facilityID}-div-${i}`;

      await prisma.$transaction(async (tx) => {
        await tx.division.upsert({
          where: { 
            divisionID 
          },
          update: {

          },
          create: {
            divisionID,
            name,
            openingTime,
            closingTime,

            facilityID
          }
        });

        if (i % 2 === 1) {
          await updateLogDAO.create(
            {
              entity: name,
              action: Action.CREATE,
              divisionID
            },
            facilityID,
            employeeID,
            tx
          );
        }
      });
    }
  }
}