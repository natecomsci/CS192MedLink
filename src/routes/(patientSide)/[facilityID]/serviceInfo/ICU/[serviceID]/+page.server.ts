import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  ICUServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
} from '$lib';


export const load: PageServerLoad = async ({ params }) => {
  const icuDAO = new ICUServiceDAO();
  const facilityDAO = new FacilityDAO();
  const servicesDAO = new ServicesDAO();
  const geographyDAO = new GeographyDAO();
  const addressDAO = new AddressDAO();
  const { facilityID, serviceID } = params;

  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      throw new Error("Service or facilityID not found.");
    }
    
    let icuService = await icuDAO.getInformation(serviceID);
    if (!icuService) {
      throw new Error("ICU Service details not found.");
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
      ...(icuService.division?.divisionID ? { divisionID: icuService.division?.divisionID } : {}),
      facilityID
    };
  } catch (error) {
    return fail(500, { description: "Could not get ICU or facility information." });
  }
};
