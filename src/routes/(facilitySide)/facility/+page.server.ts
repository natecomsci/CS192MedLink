import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';
import { FacilityDAO, EmployeeDAO } from '$lib';
import { createSession, generateSessionToken, validateSessionToken } from '$lib/server/auth';

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

  try {
    const sessionToken = cookies.get('auth-session') ?? '';

    if (!sessionToken) {
      return
    }

    const {session, employee} = await validateSessionToken(sessionToken)

    if (session !== null && employee !== null) {
      cookies.set("auth-session", sessionToken, {
          expires: session.expiresAt,
          path: "/",
        });
      throw redirect(303, '/facility/dashboard');
    }
  } catch (e) {

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

    let employee
    let facilityName
    let hasAdmins
    let hasDivisions

    try {
      const employeeDAO = new EmployeeDAO()
      employee = await employeeDAO.getByID(employeeID)

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
      facilityName = (await facilityDAO.getInformation(employee.facilityID)).name
      hasAdmins = await facilityDAO.facilityHasAdmins(employee.facilityID)
      hasDivisions = await facilityDAO.facilityHasDivisions(employee.facilityID)

    } catch (error) {
      return fail(409, { 
        error: (error as Error).message,
        description: 'ID',
        success: false
      });
    }

    cookies.set('facilityID', employee.facilityID, {path: '/'});
    cookies.set('facilityName', facilityName, {path: '/'});
    cookies.set('employeeID', employee.employeeID, {path: '/'});
    cookies.set('role', employee.role, {path: '/'});
    cookies.set('hasAdmins', String(hasAdmins), {path: '/'});
    cookies.set('hasDivisions', String(hasDivisions), {path: '/'});

    const token = generateSessionToken()
    const session = await createSession(token, employeeID)

    cookies.set("auth-session", session.sessionID, {
        expires: session.expiresAt,
        path: "/",
      });

    throw redirect(303, '/facility/dashboard');
  }
} satisfies Actions;