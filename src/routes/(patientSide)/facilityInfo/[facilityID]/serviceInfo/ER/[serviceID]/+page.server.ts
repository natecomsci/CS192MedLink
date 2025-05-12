import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from './$types';

import { getFromSearchInformation } from "$lib/server/patientSideUtility";

import { 
  ServicesDAO,
  ERServiceDAO,
  FacilityDAO,
} from '$lib';

const servicesDAO = new ServicesDAO();

const eRServiceDAO = new ERServiceDAO();

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
    const [service, eRInfo, facilityInfo, hasDivisions] = await Promise.all([
      servicesDAO.getByID(serviceID),

      eRServiceDAO.getInformation(serviceID),

      facilityDAO.getInformation(facilityID),

      facilityDAO.facilityHasDivisions(facilityID),
    ]);

    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    const response: Record<string, any> = {
      facilityID,
      fromSearch,
      load                 : eRInfo.load,
      availableBeds        : eRInfo.availableBeds,
      nonUrgentPatients    : eRInfo.nonUrgentPatients,
      nonUrgentQueueLength : eRInfo.nonUrgentQueueLength,
      urgentPatients       : eRInfo.urgentPatients,
      urgentQueueLength    : eRInfo.urgentQueueLength,
      criticalPatients     : eRInfo.criticalPatients,
      criticalQueueLength  : eRInfo.criticalQueueLength,
      updatedAt            : eRInfo.updatedAt,
    };

    if (eRInfo.note) {
      response.note = eRInfo.note;
    }

    if (eRInfo.division) {
      response.divisionName = eRInfo.division.name;
    }
  
    if (fromSearch) {
      const { fromSearchResponse, phoneSource, hoursSource } = await getFromSearchInformation({
        serviceInfo: eRInfo,
        facilityInfo,
        hasDivisions,
      });

      Object.assign(response, fromSearchResponse);

      response.phoneSource = phoneSource;
      response.hoursSource = hoursSource;
    } else {
      if (eRInfo.phoneNumber) {
        response.phoneNumber = eRInfo.phoneNumber;
      }

      if (eRInfo.openingTime && eRInfo.closingTime) {
        response.openingTime = eRInfo.openingTime;
        response.closingTime = eRInfo.closingTime;
      }
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get ambulance service information." });
  }
};