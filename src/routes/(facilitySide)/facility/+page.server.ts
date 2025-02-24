// facility log in no cookies made during successful login.
// try id:20250001 pw:password for testing
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { prisma } from '$lib/server/prisma';

import type { Actions } from './$types';

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const fid = data.get('fid') as string;
    const password = data.get('password') as string;

    console.log(`🔹 Login Attempt:`);
    console.log(`➡️ Employee ID: ${fid}`);
    console.log(`➡️ Password: ${password}`); // 🚨 Remove this in production!

    if (!fid || !password) {
      console.log(`❌ Missing Employee ID or Password.`);
      return fail(400, { error: 'Missing Employee ID or Password.' });
    }

    // Fetch facility by facilityID
    const facility = await prisma.facility.findUnique({
      where: { facilityID: fid },
    });

    if (!facility) {
      console.log(`❌ Invalid Employee ID: ${fid}`);
      return fail(400, { error: 'Invalid Employee ID or Password.' });
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(password, facility.password);
    if (!passwordMatch) {
      console.log(`❌ Password mismatch for Employee ID: ${fid}`);
      return fail(400, { error: 'Invalid Employee ID or Password.' });
    }

    console.log(`✅ Login successful for Employee ID: ${fid}`);

    // Redirect to dashboard on success
    throw redirect(303, '/dashboard');
  }
} satisfies Actions;
