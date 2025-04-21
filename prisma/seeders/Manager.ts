import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { Role } from "@prisma/client";

import { createPassword } from "./seedersUtility";

import { faker } from "@faker-js/faker";

export async function seedManager() {
  const facilities: { facilityID: string }[] = await prisma.facility.findMany({
    select: { 
      facilityID: true 
    }
  });  

  const hashedPassword: string = await createPassword();

  for (const { facilityID } of facilities) {
    const employeeID: string = `${facilityID}-manager`;

    await prisma.employee.upsert({
      where: {
        employeeID
      },
      update: {

      },
      create: {
        employeeID,
        password   : hashedPassword,
        role       : Role.MANAGER,
        fname      : faker.person.firstName(faker.person.sexType()),
        lname      : faker.person.lastName(),

        facilityID,

        ...(faker.datatype.boolean() && { mname: faker.person.middleName() })
      }
    });
  }
}