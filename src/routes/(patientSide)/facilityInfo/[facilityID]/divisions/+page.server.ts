import type { Facility } from "@prisma/client";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { DivisionDAO, FacilityDAO, type DivisionDTO } from "$lib";

const divisionDAO = new DivisionDAO();
const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ params }) => {
  const { facilityID } = params;

  if (!facilityID) {
    throw redirect(303, "/facility"); // Redirect if no facility ID is found
  }

  let divisions: DivisionDTO[]
  let facility: Facility

  try {
    divisions = await divisionDAO.getByFacility(facilityID);
    facility = await facilityDAO.getByID(facilityID);
  } catch (error) {
    console.error("Error loading facility details:", error);
    return fail(409, {
      error: "Could not get facility information.",
      success: false,
    });
  }

  return { // paul: ha
      divisions: divisions ?? [], 
      error: divisions.length === 0 ? "No divisions found for this facility." : null,
      facilityName: facility.name,
      facilityID: facility?.facilityID
    };
};

export const actions = {
  search: async ({ request, params }) => {
    const formData = await request.formData();
    let query = formData.get("query") as string;
    const { facilityID } = params;

    if (!facilityID) {
      return fail(400, { error: "Facility ID is required.", description: "search", success: false });
    }

    if (!query || query.trim() === "") {
      return fail(400, { error: "Please enter a search query.", description: "search", success: false });
    }

    query = query.trim();

    throw redirect(303, "/facilityInfo/"+facilityID+"/divisions/"+query);
  },

  viewDetails: async ({ request, params }) => {
    const formData = await request.formData();
    const { facilityID } = params;
    const divisionID = formData.get("divisionID") as string;
    const divisionName = formData.get("divisionName") as string;

    if (!facilityID || !divisionID || !divisionName) {
      return fail(400, 
        { 
          error: "Don't manipulate the hidden data please",
          description: 'search',
          success: false
        }
      );
    }

    throw redirect(303, "/facilityInfo/"+facilityID+"/divisionInfo/"+ divisionID);
  },
} satisfies Actions;
