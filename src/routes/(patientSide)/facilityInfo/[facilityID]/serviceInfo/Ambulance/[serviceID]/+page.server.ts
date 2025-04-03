import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import {  AmbulanceServiceDAO,
          FacilityDAO,
          AddressDAO,
          ServicesDAO,
          GeographyDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params }) => {
  const ambulanceDAO = new AmbulanceServiceDAO();
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const geographyDAO = new GeographyDAO();
  const servicesDAO = new ServicesDAO()
  const { facilityID, serviceID } = params;
  
  let ambulanceService = await ambulanceDAO.getInformation(serviceID);
  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      throw new Error("Service or facilityID not found.");
    }
    
    let facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility) {
      throw new Error("Facility details not found.");
    }
    
    let address = await addressDAO.getByFacility(service.facilityID);
    let fullAddress = null;

    if (address) {
      const [region, province, city, barangay] = await Promise.all([
        geographyDAO.getNameOfRegion(address.regionID),
        geographyDAO.getNameOfProvince(address.pOrCID),
        geographyDAO.getNameOfCOrM(address.cOrMID),
        geographyDAO.getNameOfBrgy(address.brgyID),
      ]);

      fullAddress = {
        street: address.street,
        region: region || "Unknown Region",
        province: province || "Unknown Province",
        city: city || "Unknown City",
        barangay: barangay || "Unknown Barangay",
      };
    }

    return {
      facilityName       : facility.name,
      facilityAddress    : fullAddress,
      phoneNumber       : ambulanceService.phoneNumber ?? null,
      openingTime       : ambulanceService.openingTime ?? null,
      closingTime       : ambulanceService.closingTime ?? null,
      baseRate          : ambulanceService.baseRate ?? null,
      minCoverageRadius : ambulanceService.minCoverageRadius ?? null,
      mileageRate       : ambulanceService.mileageRate ?? null,
      maxCoverageRadius : ambulanceService.maxCoverageRadius ?? null,
      availability      : ambulanceService.availability ?? null,
      facilityID
    };
  } catch (error) {
    return fail(500, { description: "Could not get service information." });
  }
};
