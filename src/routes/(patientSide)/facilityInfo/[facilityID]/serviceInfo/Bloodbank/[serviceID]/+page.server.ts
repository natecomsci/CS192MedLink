import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  BloodBankServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const bloodBankDAO = new BloodBankServiceDAO();
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
    let bloodBankService = await bloodBankDAO.getInformation(serviceID);
    let service = await servicesDAO.getByID(serviceID);
    
    if (!service || !service.facilityID) {
      console.error("Service or facilityID not found for serviceID:", serviceID);
      throw new Error("Service or facilityID not found.");
    }
    
    console.log("Fetching facility details for facilityID:", service.facilityID);
    let facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility) {
      console.error("Facility details not found for facilityID:", service.facilityID);
      throw new Error("Facility details not found.");
    }
    
    console.log("Fetching address details...");
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

    if (!bloodBankService.phoneNumber) {
      const address = await facilityDAO.getInformation(service.facilityID)
      phoneNumber = address.phoneNumber
      openingTime = address.openingTime
      closingTime = address.closingTime
    } else {
      phoneNumber = bloodBankService.phoneNumber
      openingTime = bloodBankService.openingTime
      closingTime = bloodBankService.closingTime
    }

    return {
      facilityName        : facility.name,
      facilityAddress     : fullAddress ?? null,
      phoneNumber       ,
      openingTime       ,
      closingTime       ,
      pricePerUnit       : bloodBankService.basePricePerUnit ?? null,
      turnaroundTimeD    : bloodBankService.turnaroundTimeD ?? null,
      turnaroundTimeH    : bloodBankService.turnaroundTimeH ?? null,
      bloodTypeAvailability: bloodBankService.bloodTypeAvailability ?? null,
      updatedAt          : bloodBankService.updatedAt ?? null,
      facilityID,
      fromSearch
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};
