import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import type { FacilityResultsDTO, ServiceResultsDTO } from "$lib/server/DTOs";
import { FacilityDAO, ServicesDAO, patientSearchPageSize } from "$lib";

const facilityDAO = new FacilityDAO();
const serviceDAO = new ServicesDAO(); 

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get("query")?.trim() || "";
    let byFacilities: { results: FacilityResultsDTO[], hasMore: boolean }
    let byService: { results: ServiceResultsDTO[], hasMore: boolean }

    try {
        byFacilities = await facilityDAO.patientSearch(query, patientSearchPageSize, 0);
        byService = await serviceDAO.patientSearch(query, patientSearchPageSize, 0);

    } catch (error) {
        console.log("📄 Page loaded. No search performed yet.");
        return fail(400, 
        { 
          error: 'Error in search action',
          description: 'search',
          success: false
        }
      );
    }

    return { 
        facilities: byFacilities.results, 
        moreFacilities: byFacilities.hasMore,
        services: byService.results, 
        moreServices: byService.hasMore,
        query,
    };
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

    let byFacilities: { results: FacilityResultsDTO[], hasMore: boolean }
    let byService: { results: ServiceResultsDTO[], hasMore: boolean }

    try {
      byFacilities = await facilityDAO.patientSearch(query, patientSearchPageSize, 0);
      byService = await serviceDAO.patientSearch(query, patientSearchPageSize, 0);

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
    console.log("✅ Search successful. Found")
    return { 
      facilities: byFacilities.results, 
      moreFacilities: byFacilities.hasMore,
      services: byService.results, 
      moreServices: byService.hasMore,
      query,
    };
  },
  viewDetails: async ({ request }) => {
    const formData = await request.formData();
    const facilityID = formData.get("facilityID") as string;


    // Redirect to the facility details page
    throw redirect(303, `/results/${facilityID}`);
  },
} satisfies Actions;
