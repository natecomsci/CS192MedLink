import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  ERServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params }) => {
  const ERDAO = new ERServiceDAO();
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const geographyDAO = new GeographyDAO();
  const servicesDAO = new ServicesDAO();
  
  const { serviceID } = params;
  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await ERDAO.getInformation(serviceID);
    console.log("Fetched Service Data:", service); // DEBUG LOG

    let facility = await servicesDAO.getByID(serviceID);
    if (!facility || !facility.facilityID) {
      console.error("Service or facilityID not found for serviceID:", serviceID);
      throw new Error("Service or facilityID not found.");
    }

    let facilityname = await facilityDAO.getGeneralInformation(facility.facilityID);
    if (!facilityname || !facilityname.name) {
      console.error("Facility details not found for facilityID:", facility.facilityID);
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

    return {
      facilityName: facilityname.name ?? "Unknown Facility",
      facilityAddress: fullAddress,
      phoneNumber: service.phoneNumber ?? null,
      load: service.load ?? null,
      availableBeds: service.availableBeds ?? null,
      nonUrgentPatients: service.nonUrgentPatients ?? null,
      nonUrgentQueueLength: service.nonUrgentQueueLength ?? null,
      urgentPatients: service.urgentPatients ?? null,
      urgentQueueLength: service.urgentQueueLength ?? null,
      criticalPatients: service.criticalPatients ?? null,
      criticalQueueLength: service.criticalQueueLength ?? null,
      updatedAt: service.updatedAt ?? null,
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};
