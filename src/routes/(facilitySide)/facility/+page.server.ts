import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import { FacilityDAO } from '$lib/server/FacilityDAO';

export const actions = {
  signIn: async ({ request, cookies }) => {
    const data = await request.formData();
    const fid = data.get('fid') as string;
    const password = data.get('password') as string;
    
    if (!fid) {
      return fail(400, 
        { 
          error: 'Missing Employee ID',
          description: 'ID',
          success: false
        }
      );
    }

    if (!password) {
      return fail(400, 
        { 
          error: 'Missing Password',
          description: 'pass',
          success: false
        }
      );
    }

    // Fetch facility by facilityID
    const facilityDAO = new FacilityDAO()
    const facility = await facilityDAO.getByID(fid);
    const hasAdmins = await facilityDAO.facilityHasAdmins(fid)
    const hasDivisions = await facilityDAO.facilityHasAdmins(fid)


    if (!facility) {
      return fail(400, 
        { 
          error: 'Facility ID not found',
          description: 'ID',
          success: false
        }
      );
    }

    // Compare entered password with hashed password
    const passwordMatch = await bcrypt.compare(password, facility.password);
    if (!passwordMatch) {
      return fail(400, 
        { 
          error: 'Incorrect ID-password pair',
          description: 'ID',
          success: false
        }
      );
    }

    // Set cookie on successful login
    cookies.set('facilityID', fid, {path: '/'});
    cookies.set('hasAdmins', String(hasAdmins), {path: '/'});
    cookies.set('hasDivisions', String(hasDivisions), {path: '/'});

    // Redirect to dashboard on success
    throw redirect(303, '/facility/dashboard');
  }
} satisfies Actions;