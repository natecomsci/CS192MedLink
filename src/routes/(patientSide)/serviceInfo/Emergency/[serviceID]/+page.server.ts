import type { Actions, PageServerLoad } from "./$types";
import { ERServiceDAO } from '$lib/server/ERDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { fail, redirect } from "@sveltejs/kit";


export const load: PageServerLoad = async ({ params }) => {
  const ERDAO = new ERServiceDAO();
  const { serviceID } = params;

  if (!serviceID) {
    throw redirect(303, "/facility");
  }

  try {
    let service = await ERDAO.getInformation(serviceID);
    
    console.log("Fetched Service Data:", service); // DEBUG LOG

    return {
      phoneNumber       : service.phoneNumber ?? null,
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};



