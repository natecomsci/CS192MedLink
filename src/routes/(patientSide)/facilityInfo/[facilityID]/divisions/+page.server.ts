import { redirect, fail } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { patientSearchPageSize, PatientDivisionListDAO } from "$lib";

const patientDivisionListDAO = new PatientDivisionListDAO();

export const load: PageServerLoad = async ({ params }) => {
  const { facilityID } = params;

  if (!facilityID) {
    return fail(400, { error: "Facility ID is required." });
  }

  try {
    const { results, totalResults, totalFetched, hasMore } =
      await patientDivisionListDAO.getLoadMoreDivisionsByFacility(
        facilityID,
        patientSearchPageSize,
        0,
        { updatedAt: "desc" }
      );

    return {
      results,
      hasMore,
      totalResults,
      totalFetched,
      patientSearchPageSize,
      facilityID,
    };
  } catch (error) {
    console.error(error);

    return fail(500, {
      description: "Could not get divisions of the facility.",
    });
  }
};

export const actions = {
  search: async ({ request, params }) => {
    const formData = await request.formData();

    const { facilityID } = params;

    let query = formData.get("query")?.toString().trim();

    if (!facilityID) {
      return fail(400, { error: "Facility ID is required.", description: "search", success: false });
    }

    if (!query) {
      return fail(400, { error: "Please enter a search query.", description: "search", success: false });
    }

    const url = `/facilityInfo/${facilityID}/divisions/${query}`;
  
    throw redirect(303, url);
  },

  viewDetails: async ({ request, params }) => {
    const formData = await request.formData();

    const { facilityID } = params;

    const divisionID = formData.get("divisionID")?.toString().trim();

    if (!facilityID || !divisionID) {
      return fail(400, { error: "Don't manipulate the hidden data please.", description: "search", success: false });
    }

    const url = `/facilityInfo/${facilityID}/serviceInfo/${divisionID}`;

    throw redirect(303, url);
  },
} satisfies Actions;
