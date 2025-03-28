import type { Actions, PageServerLoad } from "./$types";
import { OutpatientServiceDAO } from '$lib/server/OutpatientDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { ServicesDAO } from '$lib/server/ServicesDAO';
import { AddressDAO } from '$lib/server/AddressDAO';
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const outpatientDAO = new OutpatientServiceDAO();
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
    
    console.log("Fetching outpatient service details...");
    let outpatientService = await outpatientDAO.getInformation(serviceID);
    if (!outpatientService) {
      console.error("Outpatient Service details not found for serviceID:", serviceID);
      throw new Error("Outpatient Service details not found.");
    }
    
    console.log("Fetching facility details for facilityID:", service.facilityID);
    let facility = await facilityDAO.getGeneralInformation(service.facilityID);
    if (!facility) {
      console.error("Facility details not found for facilityID:", service.facilityID);
      throw new Error("Facility details not found.");
    }
    
    console.log("Fetching address details...");
    let address = await addressDAO.getByFacility(service.facilityID);
    let formattedAddress = "Address not available";

    if (address) {
      const [region, province, city, barangay] = await Promise.all([
        addressDAO.getNameOfRegion(address.regionID),
        addressDAO.getNameOfProvince(address.pOrCID),
        addressDAO.getNameOfCOrM(address.cOrMID),
        addressDAO.getNameOfBrgy(address.brgyID),
      ]);

      formattedAddress = [
        address.street,
        barangay,
        city,
        province,
        region
      ].filter(Boolean).join(", ");
    }

    return {
      facilityName    : facility.name,
      facilityAddress : formattedAddress,
      price           : outpatientService.price,
      completionTimeD : outpatientService.completionTimeD,
      completionTimeH : outpatientService.completionTimeH,
      isAvailable     : outpatientService.isAvailable,
      acceptsWalkIns  : outpatientService.acceptsWalkIns,
      ...(outpatientService.divisionID ? { divisionID: outpatientService.divisionID } : {}),
    };
  } catch (error) {
    console.error("Error loading outpatient or facility details:", error);
    return fail(500, { description: "Could not get outpatient service or facility information." });
  }
};
