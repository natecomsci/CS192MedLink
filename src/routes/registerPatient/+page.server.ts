// src/routes/registerFacility/+page.server.ts
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const hospital = formData.get('hospital') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log('Hospital:', hospital);
    console.log('Email:', email);
    console.log('Password:', password);



      //create aacount with Supabase
      const supabase = locals.supabase;
      const {error} = await supabase.auth.signUp({email, password});
    return { success: true, message: 'Facility registered successfully' };
  }
};
