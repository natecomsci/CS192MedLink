import { fail } from '@sveltejs/kit';
// import * as db from '$lib/server/db';
import { prisma } from '$lib/server/prisma';

import type { PageServerLoad, Actions } from './$types';

// export const load = (async () => {
//   const response = await prisma.user.findUnique({
//       where: { userId: 1 },
//     })

//   return { feed: response };
// }) satisfies PageServerLoad;

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const fid = data.get('fid');
    const password = data.get('password');

    if (!fid) {
      return fail(400, { fid, missing: true });
    }

    const user = await prisma.user.findUnique({
      where: { userId: Number(fid) },
    })


    if (!user || user.password !== password) {
      return fail(400, { fid, incorrect: true });
    }

    console.log(user)
    // cookies.set('sessionid', await db.createSession(user), { path: '/facility/' + user.id + '/dashboard' });

    return { success: true };
  }
} satisfies Actions;
