import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { FacilityDivisionListDAO } from '$lib';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query, currPage, change, maxPages, perPage }: { query: string, currPage: number, change: number, maxPages: number, perPage:number} = await request.json();

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

  const facilityDivisionListDAO = new FacilityDivisionListDAO()

  const { results, currentPage, totalPages } = await facilityDivisionListDAO.employeeSearchDivisionsByFacility(facilityID, query, newPageNumber, perPage, { updatedAt: "desc" });

  if (results.length === 0) {
    return json({ 
      error: 'No divisions found',
      description: 'division',
      success: false
    });
  }

  return json({list: results, currentPage, totalPages, success:true});
};