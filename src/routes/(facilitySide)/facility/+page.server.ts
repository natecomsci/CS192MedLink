import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import { FacilityDAO, EmployeeDAO } from '$lib';

export const actions = {
  signIn: async ({ request, cookies }) => {
    const facilityIDCookie = cookies.get('facilityID');
    const employeeIDCookie = cookies.get('employeeID');
    const roleCookie = cookies.get('role');
    const hasAdminsCookie = cookies.get('hasAdmins');
    const hasDivisionsCookie = cookies.get('hasDivisions');

    if (facilityIDCookie && employeeIDCookie && roleCookie && hasAdminsCookie && hasDivisionsCookie) {
      throw redirect(303, '/facility/dashboard');
    }

    const data = await request.formData();
    const employeeID = data.get('employeeID') as string;
    const password = data.get('password') as string;
    
    if (!employeeID) {
      return fail(409, 
        { 
          error: 'Missing Employee ID',
          description: 'ID',
          success: false
        }
      );
    }

    if (!password) {
      return fail(409, 
        { 
          error: 'Missing Password',
          description: 'pass',
          success: false
        }
      );
    }

    const employeeDAO = new EmployeeDAO()
    const employee = await employeeDAO.getByID(employeeID)

    if (!employee) {
      return fail(409, 
        { 
          error: 'Employee ID not found',
          description: 'ID',
          success: false
        }
      );
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return fail(409, 
        { 
          error: 'Incorrect ID-password pair',
          description: 'ID',
          success: false
        }
      );
    }

    const facilityDAO = new FacilityDAO()
    const hasAdmins = await facilityDAO.facilityHasAdmins(employee.facilityID)
    const hasDivisions = await facilityDAO.facilityHasDivisions(employee.facilityID)

    cookies.set('facilityID', employee.facilityID, {path: '/'});
    cookies.set('employeeID', employee.employeeID, {path: '/'});
    cookies.set('role', employee.role, {path: '/'});
    cookies.set('hasAdmins', String(hasAdmins), {path: '/'});
    cookies.set('hasDivisions', String(hasDivisions), {path: '/'});

    throw redirect(303, '/facility/dashboard');
  }
} satisfies Actions;