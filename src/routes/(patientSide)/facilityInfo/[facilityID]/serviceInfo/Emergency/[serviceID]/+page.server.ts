import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  ERServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
  ContactDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const ERDAO = new ERServiceDAO();
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

    const eRService = await ERDAO.getInformation(serviceID);
    if (!eRService) {
      return fail(500, { error: "ER Service details not found." });
    }

    const facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility || !facility.name) {
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
        street: address.street ?? "Unknown Street",
        region: region ?? "Unknown Region",
        province: province ?? "Unknown Province",
        city: city ?? "Unknown City",
        barangay: barangay ?? "Unknown Barangay",
      };
    }

    const phoneNumbers = await contactDAO.getPhoneNumbersByService(serviceID);
    const phoneNumber = phoneNumbers.length > 0 ? phoneNumbers[0] : "N/A";

    return {
      facilityName: facility.name ?? "Unknown Facility",
      facilityAddress: fullAddress,
      phoneNumber,
      load: eRService.load ?? null,
      availableBeds: eRService.availableBeds ?? null,
      nonUrgentPatients: eRService.nonUrgentPatients ?? null,
      nonUrgentQueueLength: eRService.nonUrgentQueueLength ?? null,
      urgentPatients: eRService.urgentPatients ?? null,
      urgentQueueLength: eRService.urgentQueueLength ?? null,
      criticalPatients: eRService.criticalPatients ?? null,
      criticalQueueLength: eRService.criticalQueueLength ?? null,
      updatedAt: eRService.updatedAt ?? null,
      facilityID,
      fromSearch
    };
  } catch (error) {
    console.error(error);
    return fail(500, { description: "Could not get service information." });
  }
};
