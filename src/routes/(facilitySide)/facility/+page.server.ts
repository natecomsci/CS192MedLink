import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import {FacilityDAO} from '$lib/server/prisma';


export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const fid = data.get('fid') as string;
    const password = data.get('password') as string;

    console.log(`🔹 Login Attempt:`);
    console.log(`➡️ Employee ID: ${fid}`);

    if (!fid || !password) {
      console.log(`❌ Missing Employee ID or Password.`);
      return fail(400, { error: 'Missing Employee ID or Password.' });
    }

    // Fetch facility by facilityID
    const facilityDAO = new FacilityDAO()
    const facility = await facilityDAO.getByID(fid);


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

    // Set cookie on successful login
    cookies.set('facilityID', fid, {path: '/'});

    // Redirect to dashboard on success
    throw redirect(303, '/dashboard');
  }
} satisfies Actions;
