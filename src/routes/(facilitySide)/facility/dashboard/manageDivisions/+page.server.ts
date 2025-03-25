import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';


import { FacilityDAO, facilityDivisionsPageSize, DivisionDAO } from '$lib';

const divisionDAO = new DivisionDAO();
const facilityDAO = new FacilityDAO();

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !hasDivisions) {
    throw redirect(303, '/facility');
  }

  if (!Boolean(hasDivisions)) {
    throw redirect(303, '/facility/dashboard')
  }
  
  const paginatedDivisions = await divisionDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize)

  return {
    divisions: paginatedDivisions.divisions,
    totalPages: paginatedDivisions.totalPages,
    currentPage: 1,
  };
};

export const actions = {
  deleteDivision: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const divisionID = data.get("divisionID") as string;
    const password = data.get("password") as string;

    if (!divisionID || !password) {
      return fail(422, { 
        error: "Division ID and password are required",
        description: "missing params",
        success: false  
      });
    }

    try {
      // // Fetch facility data from DB
      // const facility = await facilityDAO.getByID(facilityID);
      // if (!facility) {
      //   console.error(`Facility with ID ${facilityID} not found.`);
      //   return fail(404, { 
      //     error: "Facility not found",
      //     description: "not_found",
      //     success: false  
      //   });
      // }

      // // Verify password
      // const passwordMatch = await bcrypt.compare(password, facility.password);
      // if (!passwordMatch) {
      //   return fail(400, { 
      //     error: 'Incorrect ID-password pair',
      //     description: 'pass',
      //     success: false
      //   });
      // }

      // divisionDAO.delete(divisionID)

    } catch (error) {
      return fail(500, { 
        error: "Failed to delete division",
        description: "database",
        success: false  
      });
    }

    return {
      success: true
    }
  },
  
  addDivision: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    // const firstName = data.get('fname');
    // const middleName = data.get('mname');
    // const lastName = data.get('lname');
    // const pass = data.get('password');

    // let fname: string  
    // let mname: string | undefined
    // let lname: string   
    // let password: string   

    // if (!firstName || !lastName || !pass) {
    //   return fail(400, { error: 'All fields are required' });
    // }

    try {
      // fname   = validatePersonName(firstName);
      // mname  = middleName ? validatePersonName(middleName) : '';
      // lname    = validatePersonName(lastName);
      // password = await bcrypt.hash(pass.toString(), 10);

      // const division = {
      //   fname,
      //   mname,
      //   lname,
      //   password,
      // }

      // divisionDAO.create(facilityID, division)

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

  editDivision: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const data = await request.formData();

    const divisionID = data.get("divisionID") as string;

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
} satisfies Actions;
