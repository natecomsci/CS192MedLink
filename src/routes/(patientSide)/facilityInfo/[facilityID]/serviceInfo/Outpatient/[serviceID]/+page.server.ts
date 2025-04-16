import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { 
  OutpatientServiceDAO,
  FacilityDAO,
  AddressDAO,
  ServicesDAO,
  GeographyDAO,
} from '$lib';

export const load: PageServerLoad = async ({ params, url }) => {
  const outpatientDAO = new OutpatientServiceDAO();
  const facilityDAO = new FacilityDAO();
  const servicesDAO = new ServicesDAO();
  const addressDAO = new AddressDAO();
  const geographyDAO = new GeographyDAO();
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
    let service = await servicesDAO.getByID(serviceID);
    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }
    
    let outpatientService = await outpatientDAO.getInformation(serviceID);
    if (!outpatientService) {
      return fail(500, { error: "Outpatient Service details not found." });
    }
    
    let facility = await facilityDAO.getInformation(service.facilityID);
    if (!facility || facility.name) {
      return fail(500, { error: "Facility details not found." });
    }
    
    let address = await addressDAO.getByFacility(service.facilityID);
    let formattedAddress = "Address not available";

    if (address) {
      const [region, province, city, barangay] = await Promise.all([
        geographyDAO.getNameOfRegion(address.regionID),
        geographyDAO.getNameOfProvince(address.pOrCID),
        geographyDAO.getNameOfCOrM(address.cOrMID),
        geographyDAO.getNameOfBrgy(address.brgyID),
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
      price           : outpatientService.basePrice,
      completionTimeD : outpatientService.completionTimeD,
      completionTimeH : outpatientService.completionTimeH,
      isAvailable     : outpatientService.isAvailable,
      acceptsWalkIns  : outpatientService.acceptsWalkIns,
      updatedAt       : outpatientService.updatedAt,
      ...(outpatientService.division?.divisionID ? { divisionID: outpatientService.division?.divisionID } : {}),
      facilityID,
      fromSearch,
      serviceName: outpatientService.type,

    };
  } catch (error) {
    return fail(500, { description: "Could not get outpatient service or facility information." });
  }
};


