import type { Actions, PageServerLoad } from "./$types";
import { ServicesDAO } from "$lib/server/ServicesDAO";
import { redirect, fail } from "@sveltejs/kit";
import { FacilityDAO } from '$lib/server/FacilityDAO';

const servicesDAO = new ServicesDAO();
const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ params }) => {

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
      facilityName: facility.name,
      facilityID: facility?.facilityID
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



export const actions = {
  search: async ({ request, params }) => {
    const formData = await request.formData();
    let query = formData.get("query") as string;
    const { facilityID } = params;

    if (!facilityID) {
      return fail(400, { error: "Facility ID is required.", description: "search", success: false });
    }

    if (!query || query.trim() === "") {
      return fail(400, { error: "Please enter a search query.", description: "search", success: false });
    }

    query = query.trim();

    // Redirect to the specified page with query parameters
    throw redirect(303, `/servicesForSearch/${facilityID}/searchServicesWithinFacility/${query}`);
  }

} satisfies Actions;
