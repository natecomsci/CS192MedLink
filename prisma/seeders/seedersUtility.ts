import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { Load, Role, Action } from "@prisma/client";

import { FacilityDAO } from "../../src/lib/server/dataLayer/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/dataLayer/UpdateLogDAO";

import { faker } from "@faker-js/faker";

import bcrypt from "bcryptjs";

export const updateLogDAO: UpdateLogDAO = new UpdateLogDAO();

export const load: Load[] = [
  Load.STEADY,
  Load.MODERATE,
  Load.CROWDED,
  Load.NEAR_CAPACITY,
  Load.FULL_CAPACITY,
  Load.CLOSED,
];

//

export function createOperatingHours(): {
  openingTime: Date;
  closingTime: Date;
} {
  const openingTime: Date = faker.date.future();
  const closingTime: Date = faker.date.between({
    from: openingTime,
    to: new Date(openingTime.getTime() + 12 * 60 * 60 * 1000),
  });

  return { openingTime, closingTime };
}

export async function createPassword(): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);

  return await bcrypt.hash("password", salt);
}

//

export async function getFacilities(withDivs?: boolean): Promise<{ facilityID: string; employeeID: string }[]> {
  const allFacilities = await prisma.facility.findMany({
    select: {
      facilityID: true,

      employees: {
        where: {
          role: Role.MANAGER
        },
        select: {
          employeeID: true
        }
      },

      openingTime: true, // hinges on the fact na walang operating hours ang Facilities without Divisions hehe
      closingTime: true,
    }
  });

  const facilities: { 
    facilityID: string; 
    employeeID: string;
  }[] = [];

  for (const { facilityID, employees, openingTime, closingTime } of allFacilities) {
    if (employees.length === 0) {
      continue
    };

    if (withDivs) {
      if (openingTime && closingTime) {
        continue
      };
    }

    facilities.push({
      facilityID,
      employeeID: employees[0].employeeID
    });
  }

  return facilities;
}

export async function getDivisions(facilityID?: string): Promise<string[]> {
  const where = facilityID
    ? {
        facilityID
      }
    : {};

  const divisions = await prisma.division.findMany({
    where,
    select: { 
      divisionID: true 
    }
  });

  return divisions.map((division) => division.divisionID);
}

const facilityDAO: FacilityDAO = new FacilityDAO();

export async function getRandomDivisionIfAny(facilityID: string): Promise<string | undefined> {
  const hasDivision: boolean = await facilityDAO.facilityHasDivisions(facilityID);

  if (hasDivision) {
    const divisions = await getDivisions(facilityID);

    return faker.helpers.arrayElement(divisions);
  }
  return undefined;
}


type AttributeGenerator<T> = () => Record<string, unknown>;

interface SeedServiceDTO<T> {
  model: {
    upsert: (args: any) => Promise<any>;
  },
  type: string; 
  attributeGenerator: AttributeGenerator<T>;
}

export async function seedSpecializedService<T>(options: SeedServiceDTO<T>): Promise<void> {
  const { model, type, attributeGenerator } = options;

  const facilities: {
    facilityID: string;
    employeeID: string;
  }[] = await getFacilities();

  for (let i = 0; i < facilities.length; i++) {
    const { facilityID, employeeID } = facilities[i];

    if (!employeeID) {
      console.warn(`No Manager found for facility ${facilityID}. Skipping seeding.`);
      continue;
    }

    const serviceID = `${type.replace(/\s+/g, "-")}-${facilityID}`;

    const divisionID = await getRandomDivisionIfAny(facilityID);

    await prisma.$transaction(async (tx) => {
      await model.upsert({
        where: { 
          serviceID 
      },
      update: {

      },
      create: {
        service: {
          create: {
            serviceID,
            facilityID,
            type,

            ...(divisionID && { divisionID }),

            ...(faker.datatype.boolean() && {
              note: faker.lorem.words({ min: 7, max: 14 }),
            })
          }
        },

        ...attributeGenerator()
        }
      });

      if (i % 2 === 1) {
        await updateLogDAO.create(
          {
            entity: type,
            action: Action.CREATE
          },
          facilityID,
          employeeID,
          tx
        );
      }
    });
  }
}