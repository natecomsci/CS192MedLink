import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { getFacilities } from "./seedersUtility";

import { GeographyDAO } from "../../src/lib/server/dataLayer/GeographyDAO"

import { AddressDTO } from "../../src/lib/server/dataLayer/DTOs"

import { faker } from "@faker-js/faker";

const geographyDAO: GeographyDAO = new GeographyDAO();

const usedAddressKeys: Set<string> = new Set<string>();

export async function createAddress(facilityID: string, region?: number): Promise<void> {
  let regionID: number;
  let uniqueAddress: AddressDTO | null = null;

  let attempts: number = 0;

  while (attempts < 50) {
    attempts++;

    // Region

    if (region) {
      regionID = region;

    } else {
      const region = faker.helpers.arrayElement(await geographyDAO.getRegions());
      regionID = region.regionID;
    }

  // Province

  const provinces = await geographyDAO.getProvinceOfRegion(regionID);

  if (provinces.length === 0) {
    continue
  }

  const province = faker.helpers.arrayElement(provinces);
  const pOrCID = province.pOrCID;

  // City or Municipality

  const cOrMs = await geographyDAO.getCOrMOfProvince(pOrCID);

  if (cOrMs.length === 0) {
    continue
  }

  const cOrM = faker.helpers.arrayElement(cOrMs);
  const cOrMID = cOrM.cOrMID;

    // Barangay

    const brgys = await geographyDAO.getBrgyOfCOrM(cOrMID);

    if (brgys.length === 0) {
      continue
    }

    const brgy = faker.helpers.arrayElement(brgys);
    const brgyID: number = brgy.brgyID;

    // Street

    const street: string = faker.location.street();

    const addressKey: string = `${regionID}-${pOrCID}-${cOrMID}-${brgyID}-${street}`;

    if (!usedAddressKeys.has(addressKey)) {
      usedAddressKeys.add(addressKey);

      uniqueAddress = {
        regionID,
        pOrCID,
        cOrMID,
        brgyID,
        street,
      };

      break;
    }
  }

  if (!uniqueAddress) {
    console.warn(`Could not generate unique address for Facility ${facilityID}`);

    return;
  }

  await prisma.address.upsert({
    where: { 
      facilityID 
    },
    update: {

    },
    create: {
      regionID   : uniqueAddress.regionID,
      pOrCID     : uniqueAddress.pOrCID,
      cOrMID     : uniqueAddress.cOrMID,
      brgyID     : uniqueAddress.brgyID,
      street     : uniqueAddress.street,

      facilityID
    }
  });  
}

export async function seedAddress() {
  const facilities: string[] = (await getFacilities()).map((facility) => facility.facilityID);

  for (let i = 0; i < facilities.length; i++) {
    const facilityID = facilities[i];

    if (i % 2 === 0) {
      await createAddress(facilityID);
    } else {
      await createAddress(facilityID, 2); // 2 for test database, 13 for actual database
    }
  }
}