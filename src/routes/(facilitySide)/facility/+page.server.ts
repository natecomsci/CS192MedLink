import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';
import { FacilityDAO, EmployeeDAO } from '$lib';

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityName = cookies.get('facilityName');
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (facilityName && facilityID && employeeID && role && hasAdmins && hasDivisions) {
    throw redirect(303, '/facility/dashboard');
  }
};

export const actions = {
  signIn: async ({ request, cookies }) => {
    const data = await request.formData();
    const employeeID = data.get('employeeID') as string;
    const password = data.get('password') as string;
    
    if (!employeeID) {
      return fail(409, { 
        error: 'Missing Employee ID',
        description: 'ID',
        success: false
      });
    }

    if (!password) {
      return fail(409, { 
        error: 'Missing Password',
        description: 'pass',
        success: false
      });
    }

    const employeeDAO = new EmployeeDAO()
    const employee = await employeeDAO.getByID(employeeID)

    if (!employee) {
      return fail(409, { 
        error: 'Employee ID not found',
        description: 'ID',
        success: false
      });
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return fail(409, { 
        error: 'Incorrect ID-password pair',
        description: 'ID',
        success: false
      });
    }

    const facilityDAO = new FacilityDAO()
    const facilityName = (await facilityDAO.getInformation(employee.facilityID)).name
    const hasAdmins = await facilityDAO.facilityHasAdmins(employee.facilityID)
    const hasDivisions = await facilityDAO.facilityHasDivisions(employee.facilityID)

    cookies.set('facilityID', employee.facilityID, {path: '/'});
    cookies.set('facilityName', facilityName, {path: '/'});
    cookies.set('employeeID', employee.employeeID, {path: '/'});
    cookies.set('role', employee.role, {path: '/'});
    cookies.set('hasAdmins', String(hasAdmins), {path: '/'});
    cookies.set('hasDivisions', String(hasDivisions), {path: '/'});

    throw redirect(303, '/facility/dashboard');
  }
} satisfies Actions;