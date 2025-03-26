import { PrismaClient } from "@prisma/client";

import { Load, Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { FacilityDAO } from "../../src/lib/server/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

const facilityDAO = new FacilityDAO();

const updateLogDAO = new UpdateLogDAO();

export async function seedERService() {
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
    const serviceID = `er-${facility.facilityID}`;

    const hasDivision = await facilityDAO.facilityHasDivisions(facility.facilityID);

    const employeeID = facility.employees[0]?.employeeID;

    await prisma.$transaction(async (tx) => {
      await tx.eRService.upsert({
        where: { 
          serviceID 
        },
        update: {},
        create: {
          service: {
            create: {
              serviceID,
              facilityID : facility.facilityID,
              type       : "Emergency Room",

              ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
            }
          },
          phoneNumber          : `0922 000 000${i}`,
          load                 : faker.helpers.arrayElement([Load.STEADY, Load.MODERATE, Load.CROWDED, Load.NEAR_CAPACITY, Load.FULL_CAPACITY, Load.CLOSED]),
          availableBeds        : faker.number.int({ min: 0, max: 20 }),
          nonUrgentPatients    : faker.number.int({ min: 0, max: 30 }),
          nonUrgentQueueLength : faker.number.int({ min: 0, max: 10 }),
          urgentPatients       : faker.number.int({ min: 0, max: 15 }),
          urgentQueueLength    : faker.number.int({ min: 0, max: 8 }),
          criticalPatients     : faker.number.int({ min: 0, max: 10 }),
          criticalQueueLength  : faker.number.int({ min: 0, max: 5 })
        }
      });

      if (!employeeID) {
        console.warn(`No Manager found for facility ${facility.facilityID}. Skipping update log.`);
      }

      if (employeeID) {
        await updateLogDAO.createUpdateLog(
          {
            entity: "Emergency Room",
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
