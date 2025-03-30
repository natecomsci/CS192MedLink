import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  BloodBankServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params }) => {
  const bloodBankDAO = new BloodBankServiceDAO();
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const servicesDAO = new ServicesDAO();
  const { serviceID } = params;

  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let bloodBankService = await bloodBankDAO.getInformation(serviceID);
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
      facilityName        : facility.name,
      facilityAddress     : fullAddress,
      phoneNumber        : bloodBankService.phoneNumber ?? null,
      openingTime        : bloodBankService.openingTime ?? null,
      closingTime        : bloodBankService.closingTime ?? null,
      pricePerUnit       : bloodBankService.pricePerUnit ?? null,
      turnaroundTimeD    : bloodBankService.turnaroundTimeD ?? null,
      turnaroundTimeH    : bloodBankService.turnaroundTimeH ?? null,
      bloodTypeAvailability: bloodBankService.bloodTypeAvailability ?? null,
      updatedAt          : bloodBankService.updatedAt ?? null,
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};
