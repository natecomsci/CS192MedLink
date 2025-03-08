import { FacilityDAO } from "$lib/server/FacilityDAO";
import type { Actions, PageServerLoad } from "./$types";

const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async () => {
  return { facilities: await facilityDAO.getAllFacilities() };
};

export const actions: Actions = {
  /** `default` action to handle search submissions */
  default: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get("query") as string;

    if (!query) {
      return { facilities: await facilityDAO.getAllFacilities() };
    }

    return { facilities: await facilityDAO.search(query, 0) };
  },
};
