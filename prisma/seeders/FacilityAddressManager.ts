import { PrismaClient } from "@prisma/client";

import { FacilityType, Ownership, Provider, Role } from "@prisma/client";

import { faker } from "@faker-js/faker";

import bcrypt from "bcryptjs";

import { GeographyDAO } from "../../src/lib/server/GeographyDAO"

import { AddressDTO } from "../../src/lib/server/DTOs"

const prisma = new PrismaClient();

let geographyDAO: GeographyDAO = new GeographyDAO();

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export async function seedFacility() {
  let salt = await bcrypt.genSalt(10);
  let hashedPassword: string = await bcrypt.hash("password", salt);
  
  const test = [
    {
      facilityID : "cs192",
      name       : "Paul's Mental Facility",
      email      : "paul@weng.com",
      phone      : "0912 345 6789",
    },
    {
      facilityID : "cs192withdivisions",
      name       : "Paul's Mental Facility Pro",
      email      : "paul@gnew.com",
      phone      : "0998 765 4321",
    },
    ...Array.from({ length: 5 }, (_, i) => ({
      facilityID : (i + 1).toString(),
      name       : `Facility ${i + 1}`,
      email      : `facility${i + 1}@medlink.com`,
      phone      : `0920 000 000${i}`,
    })),
  ];
  
  const facilitiesWithDivisions = new Set(["cs192withdivisions", "2", "4"]);
  
  for (const { facilityID, name, email, phone } of test) {
    const hasDivisions = facilitiesWithDivisions.has(facilityID);
  
    const openingTime = faker.date.future();
    const closingTime = faker.date.between({
      from : openingTime, 
      to   : new Date(new Date(openingTime).setHours(new Date(openingTime).getHours() + 12))
    });
    const insurances = [Provider.MEDICARE, Provider.MAXICARE, Provider.INTELLICARE, Provider.PHILHEALTH]

    await prisma.facility.upsert({
      where: { 
        facilityID 
      },
      update: {},
      create: {
        facilityID: facilityID,
        name,
        photo: `https://placehold.co/600x400/png?text=${encodeURIComponent(name)}`,
        email,
        phoneNumber       : phone,
        facilityType      : faker.helpers.arrayElement([FacilityType.HOSPITAL, FacilityType.CLINIC, FacilityType.HEALTH_CENTER, FacilityType.MENTAL_HEALTH_FACILITY, FacilityType.FERTILITY_CLINIC]),
        ownership         : faker.helpers.arrayElement([Ownership.PUBLIC, Ownership.PRIVATE]),
        bookingSystem     : faker.internet.url(),
        acceptedProviders : [faker.helpers.arrayElement(insurances)],

        ...(hasDivisions ? {} : { openingTime, closingTime }),
      },
    });
  
    await prisma.employee.upsert({
      where: { 
        employeeID: facilityID 
      },
      update: {},
      create: {
        employeeID : facilityID,
        password   : hashedPassword,
        role       : Role.MANAGER,
        fname      : faker.person.firstName(faker.person.sexType()),
        lname      : faker.person.lastName(),
        facilityID : facilityID,
      },
    });
  }
  
  // address

  const facilities = await prisma.facility.findMany({
    select: {
      facilityID: true 
    }
  });
  
  const usedAddressKeys = new Set<string>()
  
  for (const facility of facilities) {
    let attempts = 0;
    let uniqueAddress: AddressDTO | null = null;
  
    while (attempts < 50) { // can adjust
      attempts;
  
      const region = getRandomItem(await geographyDAO.getRegions());

      const provinces = await geographyDAO.getProvinceOfRegion(region.regionID);
  
      if (provinces.length === 0) {
        continue
      }
  
      const province = getRandomItem(provinces);
  
      const cOrMs = await geographyDAO.getCOrMOfProvince(province.pOrCID);
  
      if (cOrMs.length === 0) {
        continue
      }
  
      const cOrM = getRandomItem(cOrMs);
  
      const brgys = await geographyDAO.getBrgyOfCOrM(cOrM.cOrMID);
  
      if (brgys.length === 0) {
        continue
      }
  
      const brgy = getRandomItem(brgys);

      const street = faker.location.street();

      const addressKey = `${region.regionID}-${province.pOrCID}-${cOrM.cOrMID}-${brgy.brgyID}-${street}`;

      if (!usedAddressKeys.has(addressKey)) {
        usedAddressKeys.add(addressKey);

        uniqueAddress = {
          regionID : region.regionID,
          pOrCID   : province.pOrCID,
          cOrMID   : cOrM.cOrMID,
          brgyID   : brgy.brgyID,
          street
        };

        break;
      }
    }
  
    if (!uniqueAddress) {
      console.warn("Could not generate Address for Facility");

      continue
    }
  
    const { regionID, pOrCID, cOrMID, brgyID, street } = uniqueAddress;
  
    await prisma.address.upsert({
      where: {
        facilityID: facility.facilityID
      },
      update: {},
      create: {
        regionID,
        pOrCID,
        cOrMID,
        brgyID,
        street,
        facilityID: facility.facilityID
      }
    });
  }
}