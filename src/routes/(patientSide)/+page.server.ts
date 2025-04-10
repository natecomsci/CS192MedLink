import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
  search: async ({ request }) => {
    // Extract form data from the request
    const formData = Object.fromEntries(await request.formData());

    // Destructure the form data safely
    const query = (formData.query?.toString().trim()) || "";
    const selectedProvider = (formData.selectedProvider?.toString().trim()) || "any";
    const selectedFacilityType = (formData.selectedFacilityType?.toString().trim()) || "any";
    const selectedOwnership = (formData.selectedOwnership?.toString().trim()) || "any";
    
    if (query === "") {
      return fail(400, { 
        error: 'Please enter a search query.',
        description: 'search',
        success: false
      });
    }
    
    throw redirect(303, `/search/${query}?selectedProvider=${selectedProvider}&selectedFacilityType=${selectedFacilityType}&selectedOwnership=${selectedOwnership}`);
  },
} satisfies Actions;

