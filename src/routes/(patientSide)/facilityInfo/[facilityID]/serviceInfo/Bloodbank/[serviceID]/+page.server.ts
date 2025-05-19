import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from './$types';

import { getFromSearchInformation } from "$lib/server/patientSideUtility";

import { 
  ServicesDAO,
  BloodBankServiceDAO,
  FacilityDAO,
} from '$lib';

const servicesDAO = new ServicesDAO();

const bloodBankServiceDAO = new BloodBankServiceDAO();

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
    const [service, bloodBankInfo, facilityInfo, hasDivisions] = await Promise.all([
      servicesDAO.getByID(serviceID),

      bloodBankServiceDAO.getInformation(serviceID),

      facilityDAO.getInformation(facilityID),

      facilityDAO.facilityHasDivisions(facilityID),
    ]);

    if (!service || !service.facilityID) {
      return fail(500, { error: "Service or facilityID not found." });
    }

    const response: Record<string, any> = {
      facilityID,
      fromSearch,
      basePricePerUnit      : bloodBankInfo.basePricePerUnit,
      turnaroundTimeD       : bloodBankInfo.turnaroundTimeD,
      turnaroundTimeH       : bloodBankInfo.turnaroundTimeH,
      bloodTypeAvailability : bloodBankInfo.bloodTypeAvailability,
      updatedAt             : bloodBankInfo.updatedAt,
    };

    if (bloodBankInfo.note) {
      response.note = bloodBankInfo.note;
    }

    if (bloodBankInfo.division) {
      response.divisionName = bloodBankInfo.division.name;
    }
  
    if (fromSearch) {
      const { fromSearchResponse, phoneSource, hoursSource } = await getFromSearchInformation({
        serviceInfo: bloodBankInfo,
        facilityInfo,
        hasDivisions,
      });

      Object.assign(response, fromSearchResponse);

      response.phoneSource = phoneSource;
      response.hoursSource = hoursSource;
    } else {
      if (bloodBankInfo.phoneNumber) {
        response.phoneNumber = bloodBankInfo.phoneNumber;
      }

      if (bloodBankInfo.openingTime && bloodBankInfo.closingTime) {
        response.openingTime = bloodBankInfo.openingTime;
        response.closingTime = bloodBankInfo.closingTime;
      }
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get ambulance service information." });
  }
};