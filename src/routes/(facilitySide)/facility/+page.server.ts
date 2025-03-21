import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { AdminDAO } from '$lib';

export const actions = {
  signIn: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');

    if (facilityID) {
      throw redirect(303, '/facility/dashboard');
    }

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
    const adminDAO = new AdminDAO()
    const facilityDAO = new FacilityDAO()
    const facility = await facilityDAO.getByID(fid);
    const employee = await adminDAO.getByID(fid)
    const hasAdmins = await facilityDAO.facilityHasAdmins(fid)
    const hasDivisions = await facilityDAO.facilityHasAdmins(fid)


    if (!employee) {
      return fail(400, 
        { 
          error: 'Employee ID not found',
          description: 'ID',
          success: false
        }
      );
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return fail(400, 
        { 
          error: 'Incorrect ID-password pair',
          description: 'ID',
          success: false
        }
      );
    }

    cookies.set('facilityID', employee.facilityID, {path: '/'});
    cookies.set('hasAdmins', String(hasAdmins), {path: '/'});
    cookies.set('hasDivisions', String(hasDivisions), {path: '/'});

    throw redirect(303, '/facility/dashboard');
  }
} satisfies Actions;