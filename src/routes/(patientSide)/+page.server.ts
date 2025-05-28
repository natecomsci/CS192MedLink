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
      .trim()
      .toUpperCase();

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
} satisfies Actions;
