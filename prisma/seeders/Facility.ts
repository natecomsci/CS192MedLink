import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { FacilityType, Ownership, Provider } from "@prisma/client";

import { createOperatingHours } from "./seedersUtility";

import { faker } from "@faker-js/faker";

async function createFacility(data: {
  facilityID: string;
  name: string;
  hasBookingSystem: boolean;
  hasProviders: boolean;
  hasDivisions: boolean;
}) {
  const type: FacilityType[] = [
    FacilityType.CLINIC,
    FacilityType.HOSPITAL,
    FacilityType.HEALTH_CENTER,
    FacilityType.DIALYSIS_CENTER,
    FacilityType.FERTILITY_CLINIC,
    FacilityType.MENTAL_HEALTH_CENTER,
    FacilityType.REHABILITATION_CENTER,
    FacilityType.SUBSTANCE_ABUSE_CENTER,
    FacilityType.PHYSICAL_THERAPY_CENTER,
  ];

  const ownership: Ownership[] = [Ownership.PUBLIC, Ownership.PRIVATE];

  const insurances: Provider[] = [
    Provider.ASIACARE,
    Provider.HC_and_D,
    Provider.MAXICARE,
    Provider.MEDICARD,
    Provider.MEDICARE,
    Provider.MEDOCARE,
    Provider.MAXICARE,
    Provider.METROCARE,
    Provider.PHILHEALTH,
    Provider.INTELLICARE,
  ];

  const { facilityID, name, hasBookingSystem, hasProviders, hasDivisions } = data;

  const { openingTime, closingTime } = createOperatingHours();

  await prisma.facility.upsert({
    where: {
      facilityID,
    },
    update: {

    },
    create: {
      facilityID,
      name,
      photo: `https://placehold.co/600x400/png?text=${encodeURIComponent(
        name
      )}`,
      facilityType : faker.helpers.arrayElement(type),
      ownership    : faker.helpers.arrayElement(ownership),

      ...(hasBookingSystem && { bookingSystem: faker.internet.url() }),

      ...(hasProviders && {
        acceptedProviders: faker.helpers.uniqueArray(
          insurances,
          faker.number.int({ min: 1, max: 5 })
        )
      }),

      ...(hasDivisions
        ? {}
        : {
            openingTime,
            closingTime,
          })
    }
  });
}

export async function seedFacility() {
  const test = [
    // use for demo

    {
      facilityID       : "cs192",
      name             : "Paul's Mental Facility",
      hasBookingSystem : true, 
      hasProviders     : true, 
      hasDivisions     : false,
    },
    {
      facilityID       : "cs192withdivisions",
      name             : "Paul's Mental Facility Pro",
      hasBookingSystem : true, 
      hasProviders     : true, 
      hasDivisions     : true,
    },

    // use for test

    {
      facilityID       : "test1",
      name             : "3rd Other Facility",
      hasBookingSystem : false, 
      hasProviders     : false, 
      hasDivisions     : false,
    },
    {
      facilityID       : "test2",
      name             : "4th Other Facility",
      hasBookingSystem : false, 
      hasProviders     : false, 
      hasDivisions     : false,
    },

    // random shit

    ...Array.from({ length: 26 }, (_, i) => ({
      facilityID       : (i + 1).toString(),
      name             : `Facility ${i + 1}`,
      hasBookingSystem : faker.datatype.boolean(),
      hasProviders     : faker.datatype.boolean(),
      hasDivisions     : faker.datatype.boolean(),
    })),
  ];

  for (const facility of test) {
    await createFacility({ ...facility });
  }
}