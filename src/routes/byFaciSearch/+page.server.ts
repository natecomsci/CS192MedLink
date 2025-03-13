import type { FacilityDTO } from "$lib/server/DTOs";
import { FacilityDAO } from "$lib/server/FacilityDAO";
import { ServicesDAO } from "$lib/server/ServicesDAO"; // Import ServiceDAO
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

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

    return { byFacilities, byService, query }; // ✅ Only returning facilities
};

export const actions: Actions = {
    default: async ({ request }) => {
        // try {
        //     const formData = await request.formData();
        //     const query = (formData.get("query") as string)?.trim() || "";
        //     const searchType = (formData.get("type") as string) || "byFacility"; // Capture search type
        //     let facilities: FacilityDTO[];

        //     console.log("🔍 Received search query:", query, "Search Type:", searchType);

        //     if (searchType === "byFacility") {
        //         facilities = await facilityDAO.search(query);
        //         console.log("✅ Search results (facilities):", facilities.map(f => f.name));
        //     } else if (searchType === "byService") {
        //         const { results } = await serviceDAO.search(query, 0);
        //         facilities = results; // ✅ Ensure facilities are returned
        //         console.log("✅ Facilities offering searched service:", facilities.map(f => f.name));
        //     } else {
        //         return fail(400, 
        //         { 
        //           error: 'Missing Password',
        //           description: 'pass',
        //           success: false
        //         }
        //       );
        //     }

        //     return { facilities };
        // } catch (error) {
        //     console.error('❌ Error in search action:', error);
        //     return { error: 'Internal Server Error', facilities: [] };
        // }

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

        return { byFacilities, byService, query }; // ✅ Only returning facilities
    },
};
