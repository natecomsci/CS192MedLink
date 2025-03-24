import type { Actions, PageServerLoad } from "./$types";
import { BloodBankServiceDAO } from '$lib/server/BloodBankDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { fail, redirect } from "@sveltejs/kit";


export const load: PageServerLoad = async ({ params }) => {
  const BloodBankDAO = new BloodBankServiceDAO();
  const { serviceID } = params;

  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await BloodBankDAO.getInformation(serviceID);
    
    console.log("Fetched Service Data:", service); // DEBUG LOG

    return {
      phoneNumber       : service.phoneNumber ?? null,
      openingTime       : service.openingTime ?? null,
      closingTime       : service.closingTime ?? null,

    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};



