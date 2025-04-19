import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { PatientServiceListDAO } from "$lib";

export const load: PageServerLoad = async ({ params, url }) => {
  const { facilityID } = params;
  const { query } = params;
  const numberToFetch = 10; // Adjust as needed
  const offset = Number(url.searchParams.get("offset")) || 0;

  const patientServiceListDAO = new PatientServiceListDAO();

  try {
    const { results, hasMore } = await patientServiceListDAO.patientSearchServicesByFacility(
      facilityID, 
      query, 
      numberToFetch, 
      offset, 
      { updatedAt: "desc" }
    )

    return {
      results, 
      hasMore, 
      query, 
      facilityID 
    };
  } catch (error) {
    console.error("Error loading services:", error);
    return fail(500, {
      description: "Could not retrieve service search results."
    });
  }
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

    throw redirect(303, "/facilityInfo/"+facilityID+"/services/"+query);
  },

  viewDetails: async ({ request, params }) => {
    const formData = await request.formData();
    const { facilityID } = params;
    const serviceID = formData.get("serviceID") as string;
    const serviceType = formData.get("serviceType") as string;

    if (!facilityID || !serviceID || !serviceType) {
      return fail(400, 
        { 
          error: "Don't manipulate the hidden data please",
          description: 'search',
          success: false
        }
      );
    }

    let url

    if (serviceType === "Ambulance") {
      url = "Ambulance/"+serviceID;
    } else if (serviceType === "Blood Bank") {
      url = "Bloodbank/"+serviceID;
    } else if (serviceType === "Emergency Room") {
      url = "Emergency/"+serviceID;
    } else if (serviceType === "Intensive Care Unit") {
      url = "ICU/"+serviceID;
    } else {
      url = "Outpatient/"+serviceID;
    }

    throw redirect(303, "/facilityInfo/"+facilityID+"/serviceInfo/"+url);
  },
} satisfies Actions;
