import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import {  AmbulanceServiceDAO,
          FacilityDAO,
          AddressDAO,
          ServicesDAO,
          GeographyDAO,
          dateToTimeMapping,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const ambulanceDAO = new AmbulanceServiceDAO();
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const geographyDAO = new GeographyDAO();
  const servicesDAO = new ServicesDAO();
  let { facilityID, serviceID } = params;
  let fromSearch = false;

  if (!serviceID || !facilityID) {
    throw redirect(303, "/");
  }

  if (url.pathname.includes("---prev=")) {
    fromSearch = true;
    serviceID = serviceID.split("---prev=", 1)[0]
  }

  try {
    let service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    let ambulanceService = await ambulanceDAO.getInformation(serviceID);
    if (!ambulanceService) {
      return fail(500, { error: "Ambulance Service details not found." });
    }

    let facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility || facility.name) {
      return fail(500, { error: "Facility details not found." });
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

    let phoneNumber
    let openingTime
    let closingTime

    if (!ambulanceService.phoneNumber) {
      const address = await facilityDAO.getInformation(service.facilityID)
      phoneNumber = address.phoneNumber
      openingTime = address.openingTime
      closingTime = address.closingTime
    } else {
      phoneNumber = ambulanceService.phoneNumber
      openingTime = ambulanceService.openingTime
      closingTime = ambulanceService.closingTime
    }

    return {
      facilityName      : facility.name,
      facilityAddress   : fullAddress,
      phoneNumber       ,
      openingTime       : dateToTimeMapping(openingTime),
      closingTime       : dateToTimeMapping(closingTime),
      baseRate          : ambulanceService.baseRate,
      minCoverageRadius : ambulanceService.minCoverageRadius,
      mileageRate       : ambulanceService.mileageRate,
      maxCoverageRadius : ambulanceService.maxCoverageRadius,
      availability      : ambulanceService.availability,
      updatedAt         : ambulanceService.updatedAt,
      serviceID,
      facilityID,
      fromSearch
    };
  } catch (error) {
    return fail(500, { description: "Could not get service information." });
  }
};
