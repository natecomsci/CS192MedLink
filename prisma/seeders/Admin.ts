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
    const divisionIDs: string[] = await getDivisions(facilityID);

    const hasDivisions: boolean = divisionIDs.length > 0;

    let index: number = 0;

    if (hasDivisions) {
      for (const divisionID of divisionIDs) {
        await createAdmin({
          facilityID,
          index: index++,
          divisionIDs: [divisionID]
        });
      }

      const remaining = 30 - divisionIDs.length;

      const mNum = Math.min(20, 30 - divisionIDs.length);

      const oNum = 30 - divisionIDs.length - mNum;

      for (let i = 0; i < oNum; i++) {
        const [randomDivision]: string[] = faker.helpers.shuffle(divisionIDs).slice(0, 1);

        await createAdmin({
          facilityID,
          index: index++,
          divisionIDs: [randomDivision]
        });
      }

      for (let i = 0; i < mNum; i++) {
        const num: number = faker.number.int({ min: 2, max: divisionIDs.length });

        const randomDivisions: string[] = faker.helpers.shuffle(divisionIDs).slice(0, num);

        await createAdmin({
          facilityID,
          index: index++,
          divisionIDs: randomDivisions
        });
      }
    } else {
      for (let i = 0; i < 20; i++) {
        await createAdmin({ facilityID, index: index++ });
      }
    }
  }
}