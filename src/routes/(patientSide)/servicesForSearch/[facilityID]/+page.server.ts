import type { PageServerLoad } from "./$types";
import { ServicesDAO } from "$lib/server/ServicesDAO";
import { redirect } from "@sveltejs/kit";
import { FacilityDAO } from '$lib/server/FacilityDAO';

export const load: PageServerLoad = async ({ params }) => {
  const servicesDAO = new ServicesDAO();
  const facilityDAO = new FacilityDAO();
  const { facilityID } = params;

  if (!facilityID) {
    throw redirect(303, "/facility"); // Redirect if no facility ID is found
  }

  try {
    let services = await servicesDAO.getByFacility(facilityID);
    let facility = await facilityDAO.getByID(facilityID);
    return {
      services: services ?? [], // Ensuring services is always an array
      error: services.length === 0 ? "No services found for this facility." : null,
      facilityName: facility
    };
    
  } catch (error) {
    console.error("Error loading facility details:", error);
    return {
      services: [],
      error: "Could not get facility information.",
      facilityName: []
    };
  }
};
