import { PrismaClient } from "@prisma/client";

import { Load, Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { FacilityDAO } from "../../src/lib/server/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

const facilityDAO = new FacilityDAO();

const updateLogDAO = new UpdateLogDAO();

export async function seedICUService() {
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
  let miscellaneous = 0;
  let divisionIndex = 0;

  for (const facility of facilities) {
    const serviceID = `icu-${facility.facilityID}`;

    const hasDivision = await facilityDAO.facilityHasDivisions(facility.facilityID);

    const employeeID = facility.employees[0]?.employeeID;

    await prisma.$transaction(async (tx) => {
      let phoneNumber = null;
      let openingTime = null;
      let closingTime = null;
      let note = null;

      if (miscellaneous < 3) {
        phoneNumber = `0933 000 000${i}`;
        openingTime = faker.date.future();
        closingTime = faker.date.between({
          from : openingTime, 
          to   : new Date(new Date(openingTime).setHours(new Date(openingTime).getHours() + 12))
        });
        note = faker.lorem.words({ min: 7, max: 14 });

        miscellaneous++;
      }

      await tx.iCUService.upsert({
        where: { 
          serviceID 
        },
        update: {},
        create: {
          service: {
            create: {
              serviceID,
              facilityID : facility.facilityID,
              type       : "Intensive Care Unit",
              note,

              ...(hasDivision && { 
                divisionID: facility.divisions[divisionIndex % facility.divisions.length].divisionID 
              })
            }
          },
          phoneNumber,
          openingTime,
          closingTime,
          load                : faker.helpers.arrayElement([Load.STEADY, Load.MODERATE, Load.CROWDED, Load.NEAR_CAPACITY, Load.FULL_CAPACITY, Load.CLOSED]),
          baseRate            : faker.number.float({ min: 1000, max: 5000, fractionDigits: 2 }),
          availableBeds       : faker.number.int({ min: 0, max: 10 }),
          cardiacSupport      : faker.datatype.boolean(),
          neurologicalSupport : faker.datatype.boolean(),
          renalSupport        : faker.datatype.boolean(),
          respiratorySupport  : faker.datatype.boolean(),
        }
      });

      if (!employeeID) {
        console.warn(`No Manager found for facility ${facility.facilityID}. Skipping update log.`);
      }

      if (employeeID) {
        await updateLogDAO.create(
          {
            entity: "Intensive Care Unit",
            action: Action.CREATE,
            ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
          },
          facility.facilityID,
          employeeID,
          tx
        );
      }
    });

    if (hasDivision) {
      divisionIndex++;
    }

    i++;
  }
}