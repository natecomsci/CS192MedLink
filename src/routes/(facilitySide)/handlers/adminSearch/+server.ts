import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { FacilityAdminListDAO } from '$lib';

const facilityAdminDAO = new FacilityAdminListDAO()

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query, currPage, change, maxPages, perPage }: { query: string, currPage: number, change: number, maxPages: number, perPage:number} = await request.json();

  if (query.length === 0) {
    return json({ 
      error: 'No query',
      description: 'query',
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

  const { results, currentPage, totalPages } = await facilityAdminDAO.employeeSearchAdminsByFacility(facilityID, query, newPageNumber, perPage, { updatedAt: "desc" });

  if (results.length === 0) {
    return json({ 
      error: 'No admins found',
      description: 'admins',
      success: false
    });
  }

  return json({list: results, currentPage, totalPages, success:true});
};