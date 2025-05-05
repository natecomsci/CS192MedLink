import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from './$types';

import { 
  BloodBankServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
  ContactDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const bloodBankDAO = new BloodBankServiceDAO();
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
    const service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    const bloodBankService = await bloodBankDAO.getInformation(serviceID);
    if (!bloodBankService) {
      return fail(500, { error: "Blood Bank Service details not found." });
    }

    const facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility) {
      return fail(500, { error: "Facility details not found." });
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
      facilityName           : facility.name,
      facilityAddress        : fullAddress,
      phoneNumber,
      openingTime            : bloodBankService.openingTime ?? facility.openingTime,
      closingTime            : bloodBankService.closingTime ?? facility.closingTime,
      pricePerUnit           : bloodBankService.basePricePerUnit ?? null,
      turnaroundTimeD        : bloodBankService.turnaroundTimeD ?? null,
      turnaroundTimeH        : bloodBankService.turnaroundTimeH ?? null,
      bloodTypeAvailability  : bloodBankService.bloodTypeAvailability ?? null,
      updatedAt              : bloodBankService.updatedAt ?? null,
      facilityID,
      serviceID,
      fromSearch
    };
  } catch (error) {
    console.error(error);
    return fail(500, { description: "Could not get service information." });
  }
};
