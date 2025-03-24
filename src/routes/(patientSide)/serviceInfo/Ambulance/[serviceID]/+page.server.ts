import type { Actions, PageServerLoad } from "./$types";
import { AmbulanceServiceDAO, } from '$lib/server/AmbulanceDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { fail, redirect } from "@sveltejs/kit";


export const load: PageServerLoad = async ({ params }) => {
  const AmbulanceDAO = new AmbulanceServiceDAO();
  const { serviceID } = params;

  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await AmbulanceDAO.getInformation(serviceID);
    
    console.log("Fetched Service Data:", service); // DEBUG LOG

    return {
      phoneNumber       : service.phoneNumber ?? null,
      openingTime       : service.openingTime ?? null,
      closingTime       : service.closingTime ?? null,
      baseRate          : service.baseRate ?? null,
      minCoverageRadius : service.minCoverageRadius ?? null,
      mileageRate       : service.mileageRate ?? null,
      maxCoverageRadius : service.maxCoverageRadius ?? null,
      availability      : service.availability ?? null,
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};



