import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { DivisionDAO, FacilityDAO, type DivisionDTO, type ServiceDTO } from "$lib";

export const load: PageServerLoad = async ({ params, url }) => {
  const { facilityID, query } = params;
  const numberToFetch = 10; // Adjust as needed
  const offset = Number(url.searchParams.get("offset")) || 0;

  const patientDivisionListDAO = new DivisionDAO();

  try {
    // Return early if query is empty (same as the DAO logic)
    if (!query.trim()) {
      return {
        results: [],
        hasMore: false,
        query,
        facilityID
      };
    }

    const { results, hasMore } = await patientDivisionListDAO.patientSearchDivisionsByFacility(
      facilityID,
      query,
      numberToFetch,
      offset,
      { updatedAt: "desc" }
    );

    return {
      results,
      hasMore,
      query,
      facilityID
    };
  } catch (error) {
    console.error("Error loading divisions:", error);
    return fail(500, {
      description: "Could not retrieve division search results."
    });
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

    throw redirect(303, "/facilityInfo/"+facilityID+"/services/"+query);
  },

  viewDetails: async ({ request, params }) => {
    const formData = await request.formData();
    const { facilityID } = params;
    const divisionID = formData.get("divisionID") as string;
    const divisionName = formData.get("divisionName") as string;

    if (!facilityID || !divisionID || !divisionName) {
      return fail(400, 
        { 
          error: "Don't manipulate the hidden data please",
          description: 'search',
          success: false
        }
      );
    }

    throw redirect(303, "/facilityInfo/"+facilityID+"/divisionInfo/"+ divisionID);
  },
} satisfies Actions;
