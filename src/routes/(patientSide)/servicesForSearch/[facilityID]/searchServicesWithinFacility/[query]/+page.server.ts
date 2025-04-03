import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { PatientServiceListDAO } from "$lib";

export const load: PageServerLoad = async ({ params, url }) => {
  const { facilityID } = params;
  const { query } = params;
  const numberToFetch = 10; // Adjust as needed
  const offset = Number(url.searchParams.get("offset")) || 0;

  const patientServiceListDAO = new PatientServiceListDAO();

  try {
    const { results, hasMore } = await patientServiceListDAO.patientSearchServicesByFacility(
      facilityID, 
      query, 
      numberToFetch, 
      offset, 
      { updatedAt: "desc" }
    )

    return {
      results, 
      hasMore, 
      query, 
      facilityID 
    };
  } catch (error) {
    console.error("Error loading services:", error);
    return fail(500, {
      description: "Could not retrieve service search results."
    });
  }
};
