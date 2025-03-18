import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { FacilityDTO } from "$lib/server/DTOs";
import { FacilityDAO } from "$lib/server/FacilityDAO";
import { ServicesDAO } from "$lib/server/ServicesDAO"; 

const facilityDAO = new FacilityDAO();
const serviceDAO = new ServicesDAO(); 

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get("query")?.trim() || "";
    const offset = Number(url.searchParams.get("offset")) || 0; // Capture offset

    let byFacilities: FacilityDTO[] = [];
    let byService: FacilityDTO[] = [];
    let hasMoreFacilities = false;
    let hasMoreServices = false;

    try {
        const facilityResult = await facilityDAO.search(query, offset);
        const serviceResult = await serviceDAO.search(query, offset);

        byFacilities = facilityResult.results;
        hasMoreFacilities = facilityResult.hasMore;

        byService = serviceResult.results;
        hasMoreServices = serviceResult.hasMore;

    } catch (error) {
        console.log("📄 Page loaded. No search performed yet.");
        return fail(400, {
            error: 'Error in search action',
            description: 'search',
            success: false
        });
    }

    return { byFacilities, hasMoreFacilities, byService, hasMoreServices, query };
};

export const actions = {
    search: async ({ request }) => {
        const formData = await request.formData();
        let query = formData.get("query") as string;
        const offset = Number(formData.get("offset")) || 0;

        if (query === "") {
            return fail(400, { 
                error: 'Please enter a search query.',
                description: 'search',
                success: false
            });
        }

        query = query.trim();

        let byFacilities: FacilityDTO[] = [];
        let byService: FacilityDTO[] = [];
        let hasMoreFacilities = false;
        let hasMoreServices = false;

        try {
            const facilityResult = await facilityDAO.search(query, offset);
            const serviceResult = await serviceDAO.search(query, offset);

            byFacilities = facilityResult.results;
            hasMoreFacilities = facilityResult.hasMore;

            byService = serviceResult.results;
            hasMoreServices = serviceResult.hasMore;

        } catch (error) {
            console.error('❌ Error in search action:', error);
            return fail(400, { 
                error: 'Error in search action',
                description: 'search',
                success: false
            });
        }

        return { byFacilities, hasMoreFacilities, byService, hasMoreServices, query };
    }
} satisfies Actions;
