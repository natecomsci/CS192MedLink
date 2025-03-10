import { FacilityDAO } from "$lib/server/FacilityDAO";
import type { Actions, PageServerLoad } from "./$types";
import { invalidate } from "$app/navigation";

const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ url }) => {
    const query = url.searchParams.get("query")?.trim() || "";
    let facilities = [];

    if (query) {
        facilities = await facilityDAO.search(query);
        console.log("✅ Facilities loaded from search:", facilities.map(f => f.name));
    } else {
        console.log("📄 Page loaded. No search performed yet.");
    }

    return { facilities };
};

export const actions: Actions = {
    default: async ({ request }) => {
        try {
            const formData = await request.formData();
            const query = (formData.get("query") as string)?.trim() || "";

            console.log("🔍 Received search query:", query);

            const facilities = await facilityDAO.search(query);

            if (facilities.length > 0) {
                console.log("✅ Search results:", facilities.map(f => f.name));
            } else {
                console.log("⚠ No results found.");
            }

            return { facilities };
        } catch (error) {
            console.error('❌ Error in search action:', error);
            return { error: 'Internal Server Error', facilities: [] };
        }
    },
};
