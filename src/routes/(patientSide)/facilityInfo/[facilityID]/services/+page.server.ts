import type { Facility } from "@prisma/client";
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { ServicesDAO, FacilityDAO, type ServiceDTO } from "$lib";

const servicesDAO = new ServicesDAO();
const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ params }) => {
  const { facilityID } = params;

  if (!facilityID) {
    throw redirect(303, "/facility"); // Redirect if no facility ID is found
  }

  let services: ServiceDTO[]
  let facility: Facility

  try {
    services = await servicesDAO.getByFacility(facilityID);
    facility = await facilityDAO.getByID(facilityID);
  } catch (error) {
    console.error("Error loading facility details:", error);
    return fail(409, {
      error: "Could not get facility information.",
      success: false,
    });
  }

  return {
      services: services ?? [], // Ensuring services is always an array
      error: services.length === 0 ? "No services found for this facility." : null,
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
      url = "BloodBank/"+serviceID;
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
