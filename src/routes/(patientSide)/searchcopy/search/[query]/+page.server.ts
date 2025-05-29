import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { patientSearchPageSize, PatientServiceListDAO } from "$lib";

const patientServiceListDAO = new PatientServiceListDAO();

export const load: PageServerLoad = async ({ params, url }) => {
  const query = params.query;

  const selectedFacilityTypes = url.searchParams
  .getAll("selectedFacilityTypes")
  .filter((type) => type.trim() !== "");

const selectedOwnership = url.searchParams
  .get("selectedOwnership")
  ?.trim();

const selectedProviders = url.searchParams
  .getAll("selectedProviders")
  .filter((provider) => provider.trim() !== "");

const filters = {
  ...(selectedOwnership && {
    ownership: selectedOwnership,
  }),
  ...(selectedFacilityTypes.length && {
    facilityType: selectedFacilityTypes,
  }),
  ...(selectedProviders.length && {
    acceptedProviders: selectedProviders,
  }),
};


  try {
    const { results, totalResults, totalFetched, hasMore } =
      await patientServiceListDAO.patientSearch(
        query,
        filters,
        patientSearchPageSize,
        0
      );

    return {
      results,
      hasMore,
      totalResults,
      totalFetched,
      query,
      selectedFacilityTypes,
      selectedOwnership,
      selectedProviders,
      patientSearchPageSize
    };
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get search results." });
  }
};

export const actions = {
  search: async ({ request }) => {
    // extracts form data from the request

    const formDataRaw = await request.formData();

    const query = formDataRaw.get("query")?.toString().trim();

    if (!query) {
      return fail(400, { error: "Please enter a search query.", description: "search", success: false });
    }

    // filters

    const selectedFacilityTypes = formDataRaw
      .getAll("selectedFacilityTypes")
      .map((type) => type.toString());

    const selectedOwnership = formDataRaw
      .get("selectedOwnership")
      ?.toString()
      .trim();

    const selectedProviders = formDataRaw
      .getAll("selectedProviders")
      .map((provider) => provider.toString());

    // !!!! INSERT MINIMUM AND MAXIMUM DISTANCE FILTERS !!!!
  
    const searchParams = new URLSearchParams();

    // Only add ownership if it's a non-empty string
    if (selectedOwnership && selectedOwnership.trim() !== "") {
      searchParams.set("selectedOwnership", selectedOwnership);
    }
    
    // Only add providers if the array is non-empty and filters out empty strings
    if (Array.isArray(selectedProviders) && selectedProviders.length > 0) {
      for (const provider of selectedProviders) {
        if (provider.trim() !== "") {
          searchParams.append("selectedProviders", provider);
        }
      }
    }
    
    // Only add facility types if the array is non-empty and filters out empty strings
    if (Array.isArray(selectedFacilityTypes) && selectedFacilityTypes.length > 0) {
      const nonEmptyFacilityTypes = selectedFacilityTypes.filter(type => type.trim() !== "");
      if (nonEmptyFacilityTypes.length > 0) {
        searchParams.set("selectedFacilityTypes", nonEmptyFacilityTypes.join(","));
      }
    }
    
    const url = `/search/${encodeURIComponent(query)}?${searchParams.toString()}`;
    
    throw redirect(303, url);
    
  },

  viewDetails: async ({ request }) => {
    const formData = await request.formData();

    const facilityID = formData.get("facilityID")?.toString().trim();

    const serviceID = formData.get("serviceID")?.toString().trim();

    const serviceType = formData.get("serviceType")?.toString().trim();

    if (!facilityID || !serviceID || !serviceType) {
      return fail(400, { error: "Don't manipulate the hidden data please.", description: "search", success: false });
    }

    const servicePath =
      {
        Ambulance: "Ambulance",
        "Blood Bank": "BloodBank",
        "Emergency Room": "ER",
        "Intensive Care Unit": "ICU",
      }[serviceType] ?? "Outpatient";

    const url = `/facilityInfo/${facilityID}/serviceInfo/${servicePath}/${serviceID}---prev=search`;

    throw redirect(303, url);
  },
} satisfies Actions;
