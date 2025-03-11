import { FacilityDAO } from "$lib/server/FacilityDAO";
import { ServicesDAO } from "$lib/server/ServicesDAO"; // Import ServiceDAO
import type { Actions, PageServerLoad } from "./$types";

const facilityDAO = new FacilityDAO();
const serviceDAO = new ServicesDAO(); 

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get("query")?.trim() || "";
    const searchType = url.searchParams.get("type") || "byFacility"; // Default to facility search
    let facilities = [];

    if (query) {
        if (searchType === "byFacility") {
            facilities = await facilityDAO.search(query);
            console.log("✅ Facilities loaded from search:", facilities.map(f => f.name));
        } else if (searchType === "byService") {
            const { results } = await serviceDAO.search(query, 0);
            facilities = results; // ✅ Ensure facilities are returned
            console.log("✅ Facilities offering services loaded:", facilities.map(f => f.name));
        }
    } else {
        console.log("📄 Page loaded. No search performed yet.");
    }

    return { facilities }; // ✅ Only returning facilities
};

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const query = (formData.get("query") as string)?.trim() || "";
            const searchType = (formData.get("type") as string) || "byFacility"; // Capture search type
            let facilities = [];

            console.log("🔍 Received search query:", query, "Search Type:", searchType);

            if (searchType === "byFacility") {
                facilities = await facilityDAO.search(query);
                console.log("✅ Search results (facilities):", facilities.map(f => f.name));
            } else if (searchType === "byService") {
                const { results } = await serviceDAO.search(query, 0);
                facilities = results; // ✅ Ensure facilities are returned
                console.log("✅ Facilities offering searched service:", facilities.map(f => f.name));
            }

            return { facilities };
        } catch (error) {
            console.error('❌ Error in search action:', error);
            return { error: 'Internal Server Error', facilities: [] };
        }
    },
};
