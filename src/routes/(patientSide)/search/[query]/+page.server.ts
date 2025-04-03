import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { patientSearchPageSize, PatientServiceListDAO } from "$lib";

const patientServiceListDAO = new PatientServiceListDAO()

export const load: PageServerLoad = async ({ params }) => {
  const query = params.query;

  try {
    let byService = await patientServiceListDAO.patientSearch(query, {}, patientSearchPageSize, 0);

    return { 
      services: byService.results, 
      moreServices: byService.hasMore,
      query,
      patientSearchPageSize,
    };

  } catch (error) {
    return fail(400, { 
      error: 'Error in search action',
      description: 'search',
      success: false
    });
  }
};

export const actions = {
  search: async ({ request }) => {
    const data = await request.formData();
    const query = (data.get("query") as string).trim();

    if (query === "") {
      return fail(400, 
        { 
          error: 'Please enter a search query.',
          description: 'search',
          success: false
        }
      );
    }

    throw redirect(303, "/search/"+query)
  },
  
  viewDetails: async ({ request }) => {
    const formData = await request.formData();
    const facilityID = formData.get("facilityID") as string;
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
      url = "BloodBank/"+serviceID;
    } else if (serviceType === "Emergency Room") {
      url = "Emergency/"+serviceID;
    } else if (serviceType === "Intensive Care Unit") {
      url = "ICU/"+serviceID;
    } else {
      url = "Outpatient/"+serviceID;
    }

    throw redirect(303, "/"+facilityID+"/serviceInfo/"+url);
  },
} satisfies Actions;
