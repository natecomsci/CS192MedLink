import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { AdminDAO, facilityAdminsPageSize } from '$lib';

const adminDAO = new AdminDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query, currPage, change, maxPages }: { query: string, currPage: number, change: number, maxPages: number} = await request.json();

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

  const { admins, currentPage, totalPages } = await adminDAO.employeeSearchAdminsByFacility(facilityID, query, newPageNumber, facilityAdminsPageSize);

  if (admins.length === 0) {
    return json({ 
      error: 'No admins found',
      description: 'admins',
      success: false
    });
  }

  return json({admins, currentPage, totalPages, success:true});
};