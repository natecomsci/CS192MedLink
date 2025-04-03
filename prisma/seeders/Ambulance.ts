import { PrismaClient } from "@prisma/client";

import { Availability, Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { FacilityDAO } from "../../src/lib/server/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

let facilityDAO: FacilityDAO = new FacilityDAO();

let updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export async function seedAmbulanceService() {
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
    const serviceID = `ambulance-${facility.facilityID}`;

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

      await tx.ambulanceService.upsert({
        where: { 
            serviceID 
        },
        update: {},
        create: {
          service: {
            create: {
              serviceID,
              facilityID : facility.facilityID,
              type       : "Ambulance",
              note,

              ...(hasDivision && { 
                divisionID: facility.divisions[divisionIndex % facility.divisions.length].divisionID 
              })
            }
          },
          phoneNumber,
          openingTime,
          closingTime,
          baseRate          : faker.number.float({ min: 500, max: 2000, fractionDigits: 2 }),
          minCoverageRadius : faker.number.float({ min:   1, max:    5, fractionDigits: 2 }),
          mileageRate       : faker.number.float({ min:  10, max:   50, fractionDigits: 2 }),
          maxCoverageRadius : faker.number.float({ min:   5, max:   15, fractionDigits: 2 }),
          availability      : faker.helpers.arrayElement([Availability.AVAILABLE, Availability.UNAVAILABLE]),
        }
      });

      if (!employeeID) {
        console.warn(`No Manager found for facility ${facility.facilityID}. Skipping update log.`);
      }
      
      if (employeeID) {
        await updateLogDAO.create(
          {
            entity: "Ambulance",
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
