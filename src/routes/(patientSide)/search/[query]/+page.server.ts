import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { patientSearchPageSize, PatientServiceListDAO } from "$lib";

const patientServiceListDAO = new PatientServiceListDAO();

export const load: PageServerLoad = async ({ params, url }) => {
  const query = params.query;

  const selectedFacilityTypes = url.searchParams.getAll(
    "selectedFacilityTypes"
  );

  const selectedOwnership = url.searchParams.get("selectedOwnership")?.trim();

  const selectedProviders = url.searchParams.getAll("selectedProviders");

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

    const searchParams = new URLSearchParams();

    // dynamically appends to query url based on set filters

    if (selectedOwnership) {
      searchParams.set("selectedOwnership", selectedOwnership);
    }

    if (selectedProviders.length) {
      for (const provider of selectedProviders) {
        searchParams.append("selectedProviders", provider);
      }
    }

    if (selectedFacilityTypes.length) {
      for (const type of selectedFacilityTypes) {
        searchParams.append("selectedFacilityTypes", type);
      }
    }

    throw redirect(
      303,
      `/search/${encodeURIComponent(query)}?${searchParams.toString()}`
    );
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
