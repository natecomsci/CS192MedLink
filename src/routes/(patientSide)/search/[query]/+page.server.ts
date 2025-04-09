import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { json, type RequestHandler } from '@sveltejs/kit';
import { patientSearchPageSize, PatientServiceListDAO } from "$lib";

const patientServiceListDAO = new PatientServiceListDAO()

export const load: PageServerLoad = async ({ params, url }) => {
  const query = params.query;
  const selectedProvider = url.searchParams.get('selectedProvider');
  const selectedOwnership = url.searchParams.get('selectedOwnership');
  const selectedFacilityType = url.searchParams.get('selectedFacilityType');

  const filters = {
    acceptedProviders: selectedProvider && selectedProvider !== "any" ? [selectedProvider] : [],
    ownership: selectedOwnership !== "any" ? selectedOwnership : undefined,
    facilityType: selectedFacilityType !== "any" ? selectedFacilityType : undefined
  };

  try {
    const byService = await patientServiceListDAO.patientSearch(query, filters, patientSearchPageSize, 0);

    return { 
      services: byService.results, 
      moreServices: byService.hasMore,
      query,
      patientSearchPageSize,
      error: null // no error
    };

  } catch (error: any) {
    console.error("❌ Caught error in load:", error);

    return {
      services: [],
      moreServices: false,
      query,
      patientSearchPageSize,
      error: error.message || 'An unexpected error occurred.'
    };
  }
};


export const actions = {
  search: async ({ request }) => {
    // Extract form data from the request
    const formData = Object.fromEntries(await request.formData());

    // Destructure the form data
    const query = (formData.query as string).trim();
    const selectedProvider = (formData.selectedProvider as string).trim() || "any"; // Default to "any"
    const selectedFacilityType = (formData.selectedFacilityType as string) || "any"; // Default to "any"
    const selectedOwnership = (formData.selectedOwnership as string) || "any"; // Default to "any"

    // Log the extracted values
    console.log("Search Query:", query);
    console.log("Selected Provider:", selectedProvider);
    console.log("Selected Facility Type:", selectedFacilityType);
    console.log("Selected Ownership:", selectedOwnership);

    // Handle empty query
    if (query === "") {
      return fail(400, 
        { 
          error: 'Please enter a search query.',
          description: 'search',
          success: false
        }
      );
    }

    // Redirect to the search page with the query
    throw redirect(303, `/search/${query}?selectedProvider=${selectedProvider}&selectedFacilityType=${selectedFacilityType}&selectedOwnership=${selectedOwnership}`);
  },
  
  viewDetails: async ({ request }) => {
    const formData = await request.formData();
    const facilityID = formData.get("facilityID") as string;
    const serviceID = formData.get("serviceID") as string;
    const serviceType = formData.get("serviceType") as string;

    // Ensure all necessary form data is provided
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

    // Construct the appropriate URL based on the service type
    if (serviceType === "Ambulance") {
      url = "Ambulance/"+serviceID+"---prev=search";
    } else if (serviceType === "Blood Bank") {
      url = "Bloodbank/"+serviceID+"---prev=search";
    } else if (serviceType === "Emergency Room") {
      url = "Emergency/"+serviceID+"---prev=search";
    } else if (serviceType === "Intensive Care Unit") {
      url = "ICU/"+serviceID+"---prev=search";
    } else {
      url = "Outpatient/"+serviceID+"---prev=search";
    }

    // Redirect to the appropriate details page
    throw redirect(303, "/facilityInfo/"+facilityID+"/serviceInfo/"+url);
  },
} satisfies Actions;
