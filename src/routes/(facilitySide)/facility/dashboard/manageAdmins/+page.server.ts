import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

import { facilityAdminsPageSize } from '$lib/index';

import { AdminDAO, FacilityDAO, validatePersonName, type PaginatedAdminDTO } from '$lib';
// import type { PaginatedAdminDTO } from '$lib/server/DTOs';

const adminDAO = new AdminDAO();
const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }
  
  const paginatedAdmins: PaginatedAdminDTO = await adminDAO.getPaginatedAdminsByFacility(facilityID, 1, facilityAdminsPageSize)

  return {
    admins: paginatedAdmins.admins,
    totalPages: paginatedAdmins.totalPages,
    currentPage: paginatedAdmins.currentPage,
  };
};

export const actions: Actions = {
  deleteAdmin: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
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
      // Fetch facility data from DB
      const facility = await facilityDAO.getByID(facilityID);
      if (!facility) {
        console.error(`Facility with ID ${facilityID} not found.`);
        return fail(404, { 
          error: "Facility not found",
          description: "not_found",
          success: false  
        });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, facility.password);
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

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const firstName = data.get('fname');
    const middleName = data.get('mname');
    const lastName = data.get('lname');
    const pass = data.get('password');

    let fname: string  
    let mname: string | undefined
    let lname: string   
    let password: string   

    if (!firstName || !lastName || !pass) {
      return fail(400, { error: 'All fields are required' });
    }

    try {
      fname   = validatePersonName(firstName);
      mname  = middleName ? validatePersonName(middleName) : '';
      lname    = validatePersonName(lastName);
      password = await bcrypt.hash(pass.toString(), 10);

      const admin = {
        fname,
        mname,
        lname,
        password,
      }

      adminDAO.create(facilityID, admin)

    } catch (error) {
      return fail(422, {
        error: (error as Error).message,
        description: "validation",
        success: false
      });
    }

    return {
      success: true
    }
  },

  editAdmin: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const adminID = data.get("adminID") as string;

    // const adminInfo = await adminDAO.getInformation(adminID);

    const firstName = data.get('fname');
    const middleName = data.get('mname');
    const lastName = data.get('lname');
    const pass = data.get('password');

    let fname: string  
    let mname: string | undefined
    let lname: string   
    let password: string   

  },
};
