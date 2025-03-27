import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { DivisionDAO, facilityDivisionsPageSize } from '$lib';

let divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query } : { query: string} = await request.json();
  if (query.length === 0) {
    return json({ 
      error: 'No query',
      description: 'qeury',
      success: false
    });
  }

  const { divisions } = await divisionDAO.employeeSearchDivisionsByFacility(facilityID, query, 1, facilityDivisionsPageSize);

  if (divisions.length === 0) {
    return json({ 
      error: 'No divisions found',
      description: 'division',
      success: false
    });
  }

  return json({divisions, success:true});
};