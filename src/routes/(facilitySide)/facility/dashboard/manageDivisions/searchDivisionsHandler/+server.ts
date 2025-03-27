import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { DivisionDAO, facilityDivisionsPageSize } from '$lib';

let divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query, currPage, change, maxPages }: { query: string, currPage: number, change: number, maxPages: number} = await request.json();

  if (query.length === 0) {
    return json({ 
      error: 'No query',
      description: 'qeury',
      success: false
    });
  }

  let newPageNumber: number

  if (currPage <= 1 && change == -1) {
    newPageNumber = currPage
  } else if (currPage >= maxPages && change == 1) {
    newPageNumber = maxPages
  } else {
    newPageNumber = currPage+change
  }

  const { divisions, currentPage, totalPages } = await divisionDAO.employeeSearchDivisionsByFacility(facilityID, query, newPageNumber, facilityDivisionsPageSize);

  if (divisions.length === 0) {
    return json({ 
      error: 'No divisions found',
      description: 'division',
      success: false
    });
  }

  return json({divisions, currentPage, totalPages, success:true});
};