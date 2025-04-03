import { fail, redirect, type Actions } from "@sveltejs/kit";

export const actions = {
  search: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get("query") as string;

    if (query === "") {
      return fail(400, { 
        error: 'Please enter a search query.',
        description: 'search',
        success: false
      });
    }
    
    throw redirect(303, '/search/'+query)
  },
} satisfies Actions;

