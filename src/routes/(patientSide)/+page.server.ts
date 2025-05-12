import { fail, redirect, type Actions } from "@sveltejs/kit";

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

    const url = `/search/${encodeURIComponent(query)}?${searchParams.toString()}`;

    throw redirect(303, url);
  },
} satisfies Actions;