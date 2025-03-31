import type { RequestHandler } from '@sveltejs/kit';
import { fail, json, redirect } from '@sveltejs/kit';
import { AdminDAO, EmployeeDAO } from '$lib';
import bcrypt from 'bcryptjs';

const adminDAO = new AdminDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');

  if (!facilityID || !employeeID) {
    throw redirect(303, '/facility');
  }

  const { adminID, passwordConfirmation } : { adminID: string, passwordConfirmation: string } = await request.json();

  const employeeDAO = new EmployeeDAO()
  const employee = await employeeDAO.getByID(employeeID)

  if (!employee) {
    console.error(`Facility with ID ${employeeID} not found.`);
    return json({ 
          error: "Employee not found",
          description: "not_found",
          success: false  
        });
  }

  const passwordMatch = await bcrypt.compare(passwordConfirmation, employee.password);
  if (!passwordMatch) {
    return json({ 
      error: 'Incorrect password',
      description: 'pass',
      success: false
    });
  }

  const newpass = await adminDAO.resetPassword(adminID);

  return json({newpass, success: true});
};