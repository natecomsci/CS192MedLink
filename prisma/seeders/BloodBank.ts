import { PrismaClient } from "@prisma/client";

import { Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { FacilityDAO } from "../../src/lib/server/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

const facilityDAO = new FacilityDAO();

const updateLogDAO = new UpdateLogDAO();

export async function seedBloodBankService() {
  const facilities = await prisma.facility.findMany({
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

  for (const facility of facilities) {
    const serviceID = `bloodbank-${facility.facilityID}`;

    const hasDivision = await facilityDAO.facilityHasDivisions(facility.facilityID);

    const employeeID = facility.employees[0]?.employeeID;

    await prisma.$transaction(async (tx) => {
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

              ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
            }
          },
          phoneNumber     : `0911 000 000${i}`,
          openingTime     : faker.date.anytime(), // does not enforce constraints
          closingTime     : faker.date.anytime(),
          pricePerUnit    : faker.number.float({ min: 500, max: 2000, fractionDigits: 2 }),
          turnaroundTimeD : faker.number.int({ min: 0, max:  5 }),
          turnaroundTimeH : faker.number.int({ min: 0, max: 23 }),

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
        await updateLogDAO.createUpdateLog(
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
