import { PrismaClient } from "@prisma/client";

import { Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export async function seedDivision() {
  const facilityIDs = ["cs192withdivisions", "2", "4"];

  const facilities = await prisma.facility.findMany({
    where: {
      facilityID: { in: facilityIDs }
    },
    include: {
      employees: {
        where: {
          role: "MANAGER"
        },
        select: {
          employeeID: true
        }
      }
    }
  });

  for (const facility of facilities) {
    const numDivisions = faker.number.int({ min: 2, max: 3 });

    const employeeID = facility.employees[0]?.employeeID;

    const usedNames = new Set<string>();

    for (let i = 0; i < numDivisions; i++) {
      let openingTime = faker.date.future();
      let closingTime = faker.date.between({
        from: openingTime, 
        to: new Date(new Date(openingTime).setHours(new Date(openingTime).getHours() + 12))
      });

      let capitalizedNoun: string;
    
      do {
        const rawNoun = faker.company.name();
    
        capitalizedNoun = rawNoun
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    
      } while (usedNames.has(capitalizedNoun));
      
      usedNames.add(capitalizedNoun);    

      const divisionID = `${facility.facilityID}-div-${i}`;

      await prisma.$transaction(async (tx) => {
        await tx.division.upsert({
          where: { 
            divisionID 
          },
          update: {},
          create: {
            divisionID,
            name        : `${capitalizedNoun} Division`,
            email       : `division${i}-${facility.facilityID}@medlink.com`,
            phoneNumber : faker.phone.number(),
            openingTime,
            closingTime,
            facilityID  : facility.facilityID,
          }
        });

        if (!employeeID) {
          console.warn(`No Manager found for facility ${facility.facilityID}. Skipping update log.`);
          return;
        }

        await updateLogDAO.create(
          {
            entity: "Division",
            action: Action.CREATE,
            divisionID
          },
          facility.facilityID,
          employeeID,
          tx
        );
      });
    }
  }
}
