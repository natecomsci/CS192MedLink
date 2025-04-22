import { Prisma } from "@prisma/client";

import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { ContactType } from "@prisma/client";

import { getFacilities, getDivisions } from "./seedersUtility";

import { ContactDAO } from "../../src/lib/server/dataLayer/ContactDAO";

import { CreateContactDTO } from "../../src/lib/server/dataLayer/DTOs";

import { faker } from "@faker-js/faker";

const contactDAO: ContactDAO = new ContactDAO();

function generatePhone(): CreateContactDTO {
  return {
    type: ContactType.PHONE,
    info:
      "0" +
      "900 000 0000".replace(/0/g, () =>
        faker.number.int({ min: 0, max: 9 }).toString()
      )
  };
}

function generateEmail(entity: string, i: number, j = 0): CreateContactDTO {
  return {
    type: ContactType.EMAIL,
    info: `${entity}${i + 1}_${j}@medlink.com`
  };
}

export async function seedContact() {
  const facilities: {
    facilityID: string;
    employeeID: string;
  }[] = await getFacilities();

  for (let i = 0; i < facilities.length; i++) {
    const { facilityID } = facilities[i];

    const divisions = await getDivisions(facilityID);

    const services = await prisma.service.findMany({
      where: {
        facilityID,
      },
      select: {
        serviceID: true,
      },
    });

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Facility

      await contactDAO.createMany(
        "facility",
        facilityID,
        [generatePhone()],
        tx
      );

      if (i % 2 === 1) {
        await contactDAO.createMany(
          "facility",
          facilityID,
          [generateEmail("facility", i)],
          tx
        );
      }

      // Division
      for (let j = 0; j < divisions.length; j++) {
        const divisionID = divisions[j];

        await contactDAO.createMany(
          "division",
          divisionID,
          [generatePhone()],
          tx
        );

        if (i % 2 === 0) {
          await contactDAO.createMany(
            "division",
            divisionID,
            [generateEmail("division", i, j)],
            tx
          );
        }
      }

      // Service

      if (i % 2 === 1) {
        for (let k = 0; k < services.length; k++) {
          const { serviceID } = services[k];

          await contactDAO.createMany(
            "service",
            serviceID,
            [generatePhone()],
            tx
          );
        }
      }
    });
  }
}