import type { Actions, PageServerLoad } from "./$types";
import { ICUServiceDAO } from '$lib/server/ICUDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { ServicesDAO } from '$lib/server/ServicesDAO';
import { AddressDAO } from '$lib/server/AddressDAO';
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const icuDAO = new ICUServiceDAO();
  const facilityDAO = new FacilityDAO();
  const servicesDAO = new ServicesDAO();
  const addressDAO = new AddressDAO();
  const { serviceID } = params;

  if (!serviceID) {
    console.warn("No serviceID provided, redirecting...");
    throw redirect(303, "/facility");
  }

  try {
    console.log("Fetching service details for serviceID:", serviceID);
    let service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      console.error("Service or facilityID not found for serviceID:", serviceID);
      throw new Error("Service or facilityID not found.");
    }
    
    console.log("Fetching ICU service details...");
    let icuService = await icuDAO.getInformation(serviceID);
    if (!icuService) {
      console.error("ICU Service details not found for serviceID:", serviceID);
      throw new Error("ICU Service details not found.");
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

    return {
      facilityName        : facility.name,
      facilityAddress     : fullAddress,
      phoneNumber         : icuService.phoneNumber,
      baseRate            : icuService.baseRate,
      load                : icuService.load,
      availableBeds       : icuService.availableBeds,
      cardiacSupport      : icuService.cardiacSupport,
      neurologicalSupport : icuService.neurologicalSupport,
      renalSupport        : icuService.renalSupport,
      respiratorySupport  : icuService.respiratorySupport,
      updatedAt           : icuService.updatedAt,
      ...(icuService.divisionID ? { divisionID: icuService.divisionID } : {}),
    };
  } catch (error) {
    console.error("Error loading ICU or facility details:", error);
    return fail(500, { description: "Could not get ICU or facility information." });
  }
};
