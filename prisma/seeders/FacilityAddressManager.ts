import { PrismaClient } from "@prisma/client";

import { FacilityType, Ownership, Role } from "@prisma/client";

import { faker } from "@faker-js/faker";

import bcrypt from "bcryptjs";

import { AddressDAO } from "../../src/lib/server//AddressDAO"

import { AddressDTO } from "../../src/lib/server//DTOs"

const prisma = new PrismaClient();

let addressDAO: AddressDAO = new AddressDAO();

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export async function seedFacility() {
  let salt = await bcrypt.genSalt(10);
  let hashedPassword: string = await bcrypt.hash("password", salt);

  // test facility n divisions

  await prisma.facility.upsert({
    where  : { 
      facilityID : "paul" 
    },
    update : {},
    create : {
      facilityID   : "paul",
      name         : "Paul's Mental Facility",
      photo        : "https://placehold.co/600x400/png?text=PaulsMentalFacility",
      email        : "paul@weng.com",
      phoneNumber  : "0912 345 6789",
      facilityType : FacilityType.MENTAL_HEALTH_FACILITY,
      ownership    : Ownership.PRIVATE,
    },
  });

  await prisma.employee.upsert({
    where  : { 
      employeeID : "paul" 
    },
    update : {},
    create : {
      employeeID : "paul",
      password   : hashedPassword,
      role       : Role.MANAGER,
      fname      : faker.person.firstName(faker.person.sexType()),
      lname      : faker.person.lastName(),
      facilityID : "paul",
    }
  });

  // test facility y divisions

  await prisma.facility.upsert({
    where  : { 
      facilityID : "paulwithdivisions" 
    },
    update : {},
    create : {
      facilityID   : "paulwithdivisions",
      name         : "Paul's Mental Facility Pro",
      photo        : "https://placehold.co/600x400/png?text=PaulsMentalFacilityPro",
      email        : "paul@gnew.com",
      phoneNumber  : "0998 765 4321",
      facilityType : FacilityType.MENTAL_HEALTH_FACILITY,
      ownership    : Ownership.PRIVATE,
    },
  });

  await prisma.employee.upsert({
    where  : { 
      employeeID : "paulwithdivisions" 
    },
    update : {},
    create : {
      employeeID : "paulwithdivisions",
      password   : hashedPassword,
      role       : Role.MANAGER,
      fname      : faker.person.firstName(faker.person.sexType()),
      lname      : faker.person.lastName(),
      facilityID : "paulwithdivisions",
    }
  });

  // 5 facilities

  for (let i = 1; i <= 5; i++) {
    // facility
  
    await prisma.facility.upsert({
      where  : { 
        facilityID : i.toString() 
      },
      update : {},
      create : {
        facilityID   : i.toString(),
        name         : `Facility ${i}`,
        photo        : `https://placehold.co/600x400/png?text=Facility+${i}`,
        email        : `facility${i}@medlink.com`,
        phoneNumber  : `0917${100000 + i}`,
        facilityType : FacilityType.HOSPITAL,
        ownership    : Ownership.PRIVATE,
      },
    });

    // manager
  
    await prisma.employee.upsert({
      where  : { 
        employeeID : i.toString() 
      },
      update : {},
      create : {
        employeeID : i.toString(),
        password   : hashedPassword,
        role       : Role.MANAGER,
        fname      : faker.person.firstName(faker.person.sexType()),
        lname      : faker.person.lastName(),
        facilityID : i.toString(),
      }
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
  
      const region = getRandomItem(await addressDAO.getRegions());

      const provinces = await addressDAO.getProvinceOfRegion(region.regionID);
  
      if (provinces.length === 0) {
        continue
      }
  
      const province = getRandomItem(provinces);
  
      const cOrMs = await addressDAO.getCOrMOfProvince(province.pOrCID);
  
      if (cOrMs.length === 0) {
        continue
      }
  
      const cOrM = getRandomItem(cOrMs);
  
      const brgys = await addressDAO.getBrgyOfCOrM(cOrM.cOrMID);
  
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