import { FacilityDAO } from "$lib/server/FacilityDAO";
import type { Actions, PageServerLoad } from "./$types";

const facilityDAO = new FacilityDAO();

// Load all facilities initially
export const load: PageServerLoad = async () => {
    try {
        const facilities = await facilityDAO.getAllFacilities();
        console.log("🏢 Facilities loaded on page init:", facilities.map(f => f.name));
        return { facilities }; // ✅ Only loads facilities on page load
    } catch (error) {
        console.error('❌ Error in load function:', error);
        return { facilities: [], error: 'Failed to load facilities' };
    }
};

// Search action
export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const query = (formData.get("query") as string)?.trim() || "";

            console.log("🔍 Received search query:", query);

            if (!query) {
                console.log("⚠️ Empty search query received. Returning empty list.");
                return { facilities: [] }; // ✅ Returns an empty list if search is empty
            }

            const facilities = await facilityDAO.search(query);
            console.log("📋 Search results:", facilities.map(f => f.name));

            return { facilities }; // ✅ Only returns search results
        } catch (error) {
            console.error('❌ Error in search action:', error);
            return { error: 'Internal Server Error', facilities: [] };
        }
    },
};
