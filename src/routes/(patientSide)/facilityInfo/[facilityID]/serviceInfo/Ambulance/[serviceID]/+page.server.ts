import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from './$types';

import { getFromSearchInformation } from "$lib/server/patientSideUtility";

import { 
  ServicesDAO,
  AmbulanceServiceDAO,
  FacilityDAO,
} from '$lib';

const servicesDAO = new ServicesDAO();

const ambulanceServiceDAO = new AmbulanceServiceDAO();

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
    const [service, ambulanceInfo, facilityInfo, hasDivisions] = await Promise.all([
      servicesDAO.getByID(serviceID),

      ambulanceServiceDAO.getInformation(serviceID),

      facilityDAO.getInformation(facilityID),

      facilityDAO.facilityHasDivisions(facilityID),
    ]);

    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    const response: Record<string, any> = {
      facilityID,
      fromSearch,
      availability      : ambulanceInfo.availability,
      baseRate          : ambulanceInfo.baseRate,
      minCoverageRadius : ambulanceInfo.minCoverageRadius,
      mileageRate       : ambulanceInfo.mileageRate,
      maxCoverageRadius : ambulanceInfo.maxCoverageRadius,
      updatedAt         : ambulanceInfo.updatedAt,
    };

    if (ambulanceInfo.note) {
      response.note = ambulanceInfo.note;
    }

    if (ambulanceInfo.division) {
      response.divisionName = ambulanceInfo.division.name;
    }
  
    if (fromSearch) {
      const { fromSearchResponse, phoneSource, hoursSource } = await getFromSearchInformation({
        serviceInfo: ambulanceInfo,
        facilityInfo,
        hasDivisions,
      });

      Object.assign(response, fromSearchResponse);

      response.phoneSource = phoneSource;
      response.hoursSource = hoursSource;
    } else {
      if (ambulanceInfo.phoneNumber) {
        response.phoneNumber = ambulanceInfo.phoneNumber;
      }

      if (ambulanceInfo.openingTime && ambulanceInfo.closingTime) {
        response.openingTime = ambulanceInfo.openingTime;
        response.closingTime = ambulanceInfo.closingTime;
      }
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get ambulance service information." });
  }
};