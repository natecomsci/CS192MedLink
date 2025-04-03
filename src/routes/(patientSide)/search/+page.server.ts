import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { patientSearchPageSize, PatientServiceListDAO } from "$lib";

const patientServiceListDAO = new PatientServiceListDAO()

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get("query")?.trim() || "";

  try {
    let byService = await patientServiceListDAO.patientSearch(query, {}, patientSearchPageSize, 0);

    return { 
      services: byService.results, 
      moreServices: byService.hasMore,
      query,
    };

  } catch (error) {
    console.log("📄 Page loaded. No search performed yet.");
    return fail(400, 
    { 
      error: 'Error in search action',
      description: 'search',
      success: false
    });
  }
};

export const actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    let query = formData.get("query") as string;

    if (query === "") {
      return fail(400, 
        { 
          error: 'Please enter a search query.',
          description: 'search',
          success: false
        }
      );
    }

    query = query.trim()

    try {
      let byService = await patientServiceListDAO.patientSearch(query, {}, patientSearchPageSize, 0);

      return { 
        services: byService.results, 
        moreServices: byService.hasMore,
        query,
      };
    } catch (error) {
      console.error('❌ Error in search action:', error);
      return fail(400, 
        { 
          error: 'Error in search action',
          description: 'search',
          success: false
        }
      );
    }
  },
  
  viewDetails: async ({ request }) => {
    const formData = await request.formData();
    const facilityID = formData.get("facilityID") as string;


    // Redirect to the facility details page
    throw redirect(303, `/results/${facilityID}`);
  },
} satisfies Actions;
