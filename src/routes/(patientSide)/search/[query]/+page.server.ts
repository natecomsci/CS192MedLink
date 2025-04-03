import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { patientSearchPageSize, PatientServiceListDAO } from "$lib";

const patientServiceListDAO = new PatientServiceListDAO()

export const load: PageServerLoad = async ({ params }) => {
  const query = params.query;

  try {
    let byService = await patientServiceListDAO.patientSearch(query, {}, patientSearchPageSize, 0);

    return { 
      services: byService.results, 
      moreServices: byService.hasMore,
      query,
    };

  } catch (error) {
    return fail(400, { 
      error: 'Error in search action',
      description: 'search',
      success: false
    });
  }
};

export const actions = {
  search: async ({ request }) => {
    const data = await request.formData();
    const query = (data.get("query") as string).trim();

    if (query === "") {
      return fail(400, 
        { 
          error: 'Please enter a search query.',
          description: 'search',
          success: false
        }
      );
    }

    throw redirect(303, "/search/"+query)
  },
  
  viewDetails: async ({ request }) => {
    const formData = await request.formData();
    const facilityID = formData.get("facilityID") as string;

    throw redirect(303, `/results/${facilityID}`);
  },
} satisfies Actions;
