import type { PageServerLoad } from "./$types";
import { ServicesDAO } from "$lib/server/ServicesDAO";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, url }) => {
  const facilityID = params.facilityID;
  const query = url.searchParams.get("query")?.trim() ?? "";
  const numberToFetch = 10; // Adjust as needed
  const offset = Number(url.searchParams.get("offset")) || 0;

  const facilityDAO = new ServicesDAO();

  try {
    const { results, hasMore } = await facilityDAO.patientSearchByFacility(
      query, numberToFetch, offset, facilityID
    );

    return {
      results, // Fix: Ensure results are returned
      hasMore,
      query, // Fix: Pass query to preserve search input
      facilityID // Fix: Pass facilityID for dynamic routing
    };
  } catch (error) {
    console.error("Error loading services:", error);
    return fail(500, {
      description: "Could not retrieve service search results."
    });
  }
};
