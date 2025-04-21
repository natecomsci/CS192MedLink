import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { Role } from "@prisma/client";

import { createPassword, getFacilities, getDivisions } from "./seedersUtility";

import { faker } from "@faker-js/faker";

async function createAdmin(data: { facilityID: string, index: number, divisionIDs?: string[] }): Promise<void> {
  const hashedPassword: string = await createPassword();

  const { facilityID, index, divisionIDs } = data;

  const employeeID: string = `${facilityID}-admin-${index}`;

  const divisionConnect = divisionIDs
    ? {
        divisions: {
          connect: divisionIDs.map((divisionID) => ({ divisionID }))
        }
      }
    : {};

  await prisma.employee.upsert({
    where: { 
      employeeID 
    },
    update: {

    },
    create: {
      employeeID,
      password : hashedPassword,
      role     : Role.ADMIN,
      fname    : faker.person.firstName(faker.person.sexType()),
      lname    : faker.person.lastName(),

      facilityID,
  
      ...divisionConnect,

      ...(faker.datatype.boolean() && { mname: faker.person.middleName() })
    }
  });
}

export async function seedAdmin() {
  const facilities = await getFacilities();

  for (const { facilityID } of facilities) {
    let divisionIDs: string[] = await getDivisions(facilityID);

    const hasDivisions: boolean = divisionIDs.length > 0;

    for (let i = 0; i < 10; i++) {
      if (hasDivisions) {
        let num: number = faker.number.int({ min: 2, max: divisionIDs.length });

        divisionIDs = faker.helpers.shuffle(divisionIDs).slice(0, num);

        await createAdmin({ facilityID, index: i, divisionIDs });
      } else {
        await createAdmin({ facilityID, index: i });
      }
    }

    if (hasDivisions) {
      for (let i = 0; i < 5; i++) {
        divisionIDs = [divisionIDs[i % divisionIDs.length]];

        await createAdmin({ facilityID, index: i + 10, divisionIDs });
      }
    }
  }
}