import { PrismaClient } from "@prisma/client";

import { Role } from "@prisma/client";

import { faker } from "@faker-js/faker";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function seedAdmin() {
  const facilities = await prisma.facility.findMany({
    select: {
      facilityID: true
    }
  });

  for (const facility of facilities) {
    const divisions = await prisma.division.findMany({
      where: {
        facilityID: facility.facilityID
      },
      select: {
        divisionID: true
      }
    });

    for (let i = 0; i < 5; i++) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password", salt);

      const employeeID = `${facility.facilityID}-admin-${i}`;

      const divisionConnect =
        divisions.length > 0
          ? {
              divisions: {
                connect: [{ divisionID: divisions[i % divisions.length].divisionID }]
              }
            }
          : {};

      await prisma.employee.upsert({
        where: { employeeID },
        update: {},
        create: {
          employeeID,
          password   : hashedPassword,
          role       : Role.ADMIN,
          fname      : faker.person.firstName(faker.person.sexType()),
          lname      : faker.person.lastName(),
          facilityID : facility.facilityID,
          ...divisionConnect
        }
      });
    }
  }
}