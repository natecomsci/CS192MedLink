import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import {
  ICUServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
  ContactDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const icuDAO = new ICUServiceDAO();
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const geographyDAO = new GeographyDAO();
  const servicesDAO = new ServicesDAO();
  const contactDAO = new ContactDAO();

  let { facilityID, serviceID } = params;
  let fromSearch = false;

  if (!serviceID || !facilityID) {
    throw redirect(303, "/");
  }

  if (url.pathname.includes("---prev=")) {
    fromSearch = true;
    serviceID = serviceID.split("---prev=", 1)[0];
  }

  try {
    const icuService = await icuDAO.getInformation(serviceID);
    const service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      throw new Error("Service or facilityID not found.");
    }

    const facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility) {
      throw new Error("Facility details not found.");
    }

    const address = await addressDAO.getByFacility(service.facilityID);
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

    const phoneNumbers = await contactDAO.getPhoneNumbersByService(serviceID);
    const phoneNumber = phoneNumbers.length > 0 ? phoneNumbers[0] : "N/A";

    return {
      facilityName        : facility.name,
      facilityAddress     : fullAddress,
      phoneNumber         ,
      openingTime         : icuService.openingTime ?? facility.openingTime,
      closingTime         : icuService.closingTime ?? facility.closingTime,
      baseRate            : icuService.baseRate,
      load                : icuService.load,
      availableBeds       : icuService.availableBeds,
      cardiacSupport      : icuService.cardiacSupport,
      neurologicalSupport : icuService.neurologicalSupport,
      renalSupport        : icuService.renalSupport,
      respiratorySupport  : icuService.respiratorySupport,
      updatedAt           : icuService.updatedAt,
      ...(icuService.division?.divisionID ? { divisionID: icuService.division?.divisionID } : {}),
      serviceID,
      facilityID,
      fromSearch
    };
  } catch (error) {
    console.error(error);
    return fail(500, { description: "Could not get ICU or facility information." });
  }
};
