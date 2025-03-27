import type { Actions, PageServerLoad } from "./$types";
import { AmbulanceServiceDAO } from '$lib/server/AmbulanceDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { AddressDAO } from '$lib/server/AddressDAO';
import { fail, redirect } from "@sveltejs/kit";
import { ServicesDAO } from '$lib/server/ServicesDAO';

export const load: PageServerLoad = async ({ params }) => {
  const ambulanceDAO = new AmbulanceServiceDAO();
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const servicesDAO = new ServicesDAO()
  const { serviceID } = params;
  
  let ambulanceService = await ambulanceDAO.getInformation(serviceID);
  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      console.error("Service or facilityID not found for serviceID:", serviceID);
      throw new Error("Service or facilityID not found.");
    }
    
    console.log("Fetching facility details for facilityID:", service.facilityID);
    let facility = await facilityDAO.getGeneralInformation(service.facilityID);
    if (!facility) {
      console.error("Facility details not found for facilityID:", service.facilityID);
      throw new Error("Facility details not found.");
    }
    
    console.log("Fetching address details...");
    let address = await addressDAO.getByFacility(service.facilityID);
    let fullAddress = null;

    if (address) {
      const [region, province, city, barangay] = await Promise.all([
        addressDAO.getNameOfRegion(address.regionID),
        addressDAO.getNameOfProvince(address.pOrCID),
        addressDAO.getNameOfCOrM(address.cOrMID),
        addressDAO.getNameOfBrgy(address.brgyID),
      ]);

      fullAddress = {
        street: address.street,
        region: region || "Unknown Region",
        province: province || "Unknown Province",
        city: city || "Unknown City",
        barangay: barangay || "Unknown Barangay",
      };
    }

    console.log("Fetched Service Data:", service);

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
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};
