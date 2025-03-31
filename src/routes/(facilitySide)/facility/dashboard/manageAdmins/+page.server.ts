import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { 
  AdminDAO, 
  EmployeeDAO, 
  validatePersonName, 
  facilityAdminsPageSize, 
  type PaginatedAdminDTO, 
  DivisionDAO, 
  type DivisionDTO,
  type Create_UpdateAdminDTO,
} from '$lib';

const adminDAO = new AdminDAO();
const employeeDAO = new EmployeeDAO();

let facilityDivisions: string[] = []

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !hasDivisions) {
    throw redirect(303, '/facility');
  }
  
  const paginatedAdmins: PaginatedAdminDTO = await adminDAO.getPaginatedAdminsByFacility(facilityID, 1, facilityAdminsPageSize)

  let data: { [key: string]: any } = {
    admins: paginatedAdmins.admins,
    totalPages: paginatedAdmins.totalPages,
    currentPage: paginatedAdmins.currentPage,
    hasDivisions: hasDivisions === 'true' ? true : false,
  }

  if (hasDivisions === 'true' ? true : false) {
    const divisionDAO = new DivisionDAO();
    const divisions: DivisionDTO[] = await divisionDAO.getByFacility(facilityID);
    facilityDivisions = divisions.map(({divisionID}) => divisionID)
    data.divisions = divisions
  }

  return data
};

export const actions: Actions = {
  deleteAdmin: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');
    const role = cookies.get('role');
    const employeeID = cookies.get('employeeID');

    if (!facilityID || !employeeID || !role) {
      throw redirect(303, '/facility');
    }

    if (role != Role.MANAGER) {
      return fail(422, { 
        error: "Managers are the only ones who can delete admins",
        description: "wrong permissions",
        success: false  
      });
    }

    const data = await request.formData();

    const adminID = data.get("adminID") as string;
    const password = data.get("password") as string;

    if (!adminID || !password) {
      return fail(422, { 
        error: "Admin ID and password are required",
        description: "missing params",
        success: false  
      });
    }

    try {
      const employee = await employeeDAO.getByID(employeeID);

      if (!employee) {
        console.error(`Facility with ID ${employeeID} not found.`);
        return fail(404, { 
          error: "Employee not found",
          description: "not_found",
          success: false  
        });
      }

      const passwordMatch = await bcrypt.compare(password, employee.password);
      if (!passwordMatch) {
        return fail(400, { 
          error: 'Incorrect ID-password pair',
          description: 'pass',
          success: false
        });
      }

      adminDAO.delete(adminID)

    } catch (error) {
      return fail(500, { 
        error: "Failed to delete admin",
        description: "database",
        success: false  
      });
    }

    return {
      success: true
    }
  },
  
  addAdmin: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const role = cookies.get('role');
    const hasDivisions = cookies.get('hasDivisions');

    if (role != Role.MANAGER) {
      return fail(422, { 
        error: "Managers are the only ones who can delete admins",
        description: "wrong permissions",
        success: false  
      });
    }

    if (!facilityID || !hasDivisions || !role) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const firstName = data.get('fname');
    const middleName = data.get('mname');
    const lastName = data.get('lname');

    

    try {
      const fname   = validatePersonName(firstName);
      const lname   = validatePersonName(lastName);

      let admin: Create_UpdateAdminDTO = {fname, lname}

      if (middleName) {
        const mname = validatePersonName(middleName);
        admin.mname = mname;
      }

      if (hasDivisions === 'true' ? true : false) {
        let divisionsHandled: string[] = []

        for (const d of facilityDivisions) {
          if (data.get(d) === "on") {
            divisionsHandled.push(d);
          }
        }
        admin.divisions = divisionsHandled
      }

      adminDAO.create(facilityID, admin)
      return {
        success: true
      }

    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }
  },

  editAdmin: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const role = cookies.get('role');
    const hasDivisions = cookies.get('hasDivisions');

    if (!facilityID || !hasDivisions || !role) {
      throw redirect(303, '/facility');
    }

    if (role != Role.MANAGER) {
      return fail(422, { 
        error: "Managers are the only ones who can delete admins",
        description: "wrong permissions",
        success: false  
      });
    }
    
    const data = await request.formData();

    const adminID = data.get('adminID') as string;

    const admin = await adminDAO.getInformation(adminID)

    if (!admin) {
      return fail(422, {
        error: "No employee found",
        description: "validation",
        success: false
      });
    }

    const defFname = admin.fname
    const defMname = admin.mname
    const defLname = admin.lname
    const defDivisions = admin.divisions ?? []
    
    const firstName = data.get('fname');
    const middleName = data.get('mname');
    const lastName = data.get('lname');

    try {
      
      const fname   = validatePersonName(firstName);
      const lname   = validatePersonName(lastName);
      let divisionsHandled: string[] = []

      let admin: Create_UpdateAdminDTO = {fname, lname}

      if (middleName) {
        const mname = validatePersonName(middleName);
        admin.mname = mname;
      }

      if (hasDivisions === 'true' ? true : false) {
        for (const d of facilityDivisions) {
          if (data.get(d) === "on") {
            divisionsHandled.push(d);
          }
        }
        admin.divisions = divisionsHandled
      }

      if (defFname == fname &&
          defMname == (middleName as string) &&
          defLname == lname && 
          defDivisions.toString() == divisionsHandled.toString()
        ) {
        return fail(422, { 
          error: "No changes made",
          description: "button",
          success: false  
        });
      }

      adminDAO.update(adminID, admin)

      return {
        success: true
      }

    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }
  },
};
