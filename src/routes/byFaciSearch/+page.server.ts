import { fail } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";
import type { FacilityDTO } from "$lib/server/DTOs";

import { FacilityDAO } from "$lib/server/FacilityDAO";
import { ServicesDAO } from "$lib/server/ServicesDAO"; 

const facilityDAO = new FacilityDAO();
const serviceDAO = new ServicesDAO(); 

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get("query")?.trim() || "";
    let byFacilities: FacilityDTO[];
    let byService: FacilityDTO[];

    try {
        byFacilities = await facilityDAO.search(query);
        byService = (await serviceDAO.search(query, 0)).results;

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

    return { byFacilities, byService, query };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const query = (formData.get("query") as string)?.trim() || "";  

        let byFacilities: FacilityDTO[];
        let byService: FacilityDTO[];

        try {
            byFacilities = await facilityDAO.search(query);
            byService = (await serviceDAO.search(query, 0)).results;

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
        return { byFacilities, byService, query }; 
    },
} satisfies Actions;
