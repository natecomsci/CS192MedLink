import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from './$types';

import { getFromSearchInformation } from "$lib/server/patientSideUtility";

import { 
  ServicesDAO,
  ICUServiceDAO,
  FacilityDAO,
} from '$lib';

const servicesDAO = new ServicesDAO();

const iCUServiceDAO = new ICUServiceDAO();

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
    const [service, iCUInfo, facilityInfo, hasDivisions] = await Promise.all([
      servicesDAO.getByID(serviceID),

      iCUServiceDAO.getInformation(serviceID),

      facilityDAO.getInformation(facilityID),

      facilityDAO.facilityHasDivisions(facilityID),
    ]);

    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    const response: Record<string, any> = {
      facilityID,
      fromSearch,
      load                : iCUInfo.load,
      baseRate            : iCUInfo.baseRate,
      availableBeds       : iCUInfo.availableBeds,
      cardiacSupport      : iCUInfo.cardiacSupport,
      neurologicalSupport : iCUInfo.neurologicalSupport,
      renalSupport        : iCUInfo.renalSupport,
      respiratorySupport  : iCUInfo.respiratorySupport,
      updatedAt           : iCUInfo.updatedAt,
    };

    if (iCUInfo.note) {
      response.note = iCUInfo.note;
    }

    if (iCUInfo.division) {
      response.divisionName = iCUInfo.division.name;
    }
  
    if (fromSearch) {
      const { fromSearchResponse, phoneSource, hoursSource } = await getFromSearchInformation({
        serviceInfo: iCUInfo,
        facilityInfo,
        hasDivisions,
      });

      Object.assign(response, fromSearchResponse);

      response.phoneSource = phoneSource;
      response.hoursSource = hoursSource;
    } else {
      if (iCUInfo.phoneNumber) {
        response.phoneNumber = iCUInfo.phoneNumber;
      }

      if (iCUInfo.openingTime && iCUInfo.closingTime) {
        response.openingTime = iCUInfo.openingTime;
        response.closingTime = iCUInfo.closingTime;
      }
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get ambulance service information." });
  }
};