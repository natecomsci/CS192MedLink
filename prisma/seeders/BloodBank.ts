import { PrismaClient } from "@prisma/client";

import { Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { FacilityDAO } from "../../src/lib/server/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

const facilityDAO = new FacilityDAO();

const updateLogDAO = new UpdateLogDAO();

export async function seedBloodBankService() {
  const facilityIDs = ["cs192withdivisions", "2", "4"];

  const facilities = await prisma.facility.findMany({
    where: {
      facilityID: { 
        in: facilityIDs 
      }
    },
    include: {
      divisions: true,
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

  let i = 0;
  let miscellaneous = 0; // Track how many services have opening/closing times and notes

  for (const facility of facilities) {
    const serviceID = `bloodbank-${facility.facilityID}`;

    const hasDivision = await facilityDAO.facilityHasDivisions(facility.facilityID);

    const employeeID = facility.employees[0]?.employeeID;

    await prisma.$transaction(async (tx) => {
      let phoneNumber = null;
      let openingTime = null;
      let closingTime = null;
      let note = null;

      if (miscellaneous < 3) {
        phoneNumber = `0911 000 000${i}`;
        openingTime = faker.date.future();
        closingTime = faker.date.between({
          from : openingTime, 
          to   : new Date(new Date(openingTime).setHours(new Date(openingTime).getHours() + 12))
        });
        note = faker.lorem.words({ min: 7, max: 14 });

        miscellaneous++;
      }

      await tx.bloodBankService.upsert({
        where: { 
          serviceID 
        },
        update: {},
        create: {
          service: {
            create: {
              serviceID,
              facilityID : facility.facilityID,
              type       : "Blood Bank",
              note,

              ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
            }
          },
          phoneNumber,
          openingTime,
          closingTime,
          basePricePerUnit : faker.number.float({ min: 500, max: 2000, fractionDigits: 2 }),
          turnaroundTimeD  : faker.number.int({ min: 0, max:  5 }),
          turnaroundTimeH  : faker.number.int({ min: 0, max: 23 }),

          bloodTypeAvailability: {
            create: {
              A_P  : faker.datatype.boolean(),
              A_N  : faker.datatype.boolean(),
              B_P  : faker.datatype.boolean(),
              B_N  : faker.datatype.boolean(),
              O_P  : faker.datatype.boolean(),
              O_N  : faker.datatype.boolean(),
              AB_P : faker.datatype.boolean(),
              AB_N : faker.datatype.boolean(),
            }
          }
        }
      });

      if (!employeeID) {
        console.warn(`No Manager found for facility ${facility.facilityID}. Skipping update log.`);
      }

      if (employeeID) {
        await updateLogDAO.create(
          {
            entity: "Blood Bank",
            action: Action.CREATE,
            ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
          },
          facility.facilityID,
          employeeID,
          tx
        );
      }
    });

    i++;
  }
}