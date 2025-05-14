import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from './$types';

import { getFromSearchInformation } from "$lib/server/patientSideUtility";

import { 
  ServicesDAO,
  OutpatientServiceDAO,
  FacilityDAO,
} from '$lib';

const servicesDAO = new ServicesDAO();

const outpatientServiceDAO = new OutpatientServiceDAO();

const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ params, url }) => {
  let { facilityID, serviceID } = params;

  if (!serviceID || !facilityID) {
    return fail(400, { error: "Facility ID and Service ID is required." });
  }

  const fromSearch = url.pathname.includes("---prev=");

  if (fromSearch) {
    serviceID = serviceID.split("---prev=", 1)[0];
  }

  try {
    const [service, outpatientInfo, facilityInfo, hasDivisions] = await Promise.all([
      servicesDAO.getByID(serviceID),

      outpatientServiceDAO.getInformation(serviceID),

      facilityDAO.getInformation(facilityID),

      facilityDAO.facilityHasDivisions(facilityID),
    ]);

    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    const response: Record<string, any> = {
      facilityID,
      fromSearch,
      type            : outpatientInfo.type,
      basePrice       : outpatientInfo.basePrice,
      completionTimeD : outpatientInfo.completionTimeD,
      completionTimeH : outpatientInfo.completionTimeH,
      isAvailable     : outpatientInfo.isAvailable,
      acceptsWalkIns  : outpatientInfo.acceptsWalkIns,
      updatedAt       : outpatientInfo.updatedAt,
    };

    if (outpatientInfo.note) {
      response.note = outpatientInfo.note;
    }

    if (outpatientInfo.division) {
      response.divisionName = outpatientInfo.division.name;
    }
  
    if (fromSearch) {
      const { fromSearchResponse, phoneSource, hoursSource } = await getFromSearchInformation({
        serviceInfo: outpatientInfo,
        facilityInfo,
        hasDivisions,
      });

      Object.assign(response, fromSearchResponse);

      response.phoneSource = phoneSource;
      response.hoursSource = hoursSource;
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get ambulance service information." });
  }
};