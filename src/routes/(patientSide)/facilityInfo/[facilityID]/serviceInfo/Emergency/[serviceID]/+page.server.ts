import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  ERServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const ERDAO = new ERServiceDAO();
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
    let eRService = await ERDAO.getInformation(serviceID);
    let service = await servicesDAO.getByID(serviceID);

    let facility = await servicesDAO.getByID(serviceID);
    if (!facility || !facility.facilityID) {
      throw new Error("Service or facilityID not found.");
    }

    let facilityname = await facilityDAO.getInformation(facility.facilityID);
    if (!facilityname || !facilityname.name) {
      throw new Error("Facility details not found.");
    }

    let address = await addressDAO.getByFacility(facility.facilityID);
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

    let phoneNumber
    // let openingTime
    // let closingTime

    if (!eRService.phoneNumber) {
      const address = await facilityDAO.getInformation(service.facilityID)
      phoneNumber = address.phoneNumber
      // openingTime = address.openingTime
      // closingTime = address.closingTime
    } else {
      phoneNumber = eRService.phoneNumber
      // openingTime = eRService.openingTime
      // closingTime = eRService.closingTime
    }

    return {
      facilityName: facilityname.name ?? "Unknown Facility",
      facilityAddress: fullAddress,
      phoneNumber ,
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
    return fail(500, { description: "Could not get service information." });
  }
};
