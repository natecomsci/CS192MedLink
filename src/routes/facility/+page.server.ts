import { fail } from '@sveltejs/kit';
// import * as db from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (!email) {
      return fail(400, { email, missing: true });
    }

    // const user = await db.getUser(email);

    // if (!user || user.password !== password) {
    //   return fail(400, { email, incorrect: true });
    // }

    // cookies.set('sessionid', await db.createSession(user), { path: '/facility/' + user.id + '/dashboard' });

    return { success: true };
  }
} satisfies Actions;
