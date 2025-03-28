import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { DivisionDAO, facilityDivisionsPageSize } from '$lib';

let divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const {currPage, change, maxPages}: {currPage: number, change: number, maxPages: number} = await request.json();

  let newPageNumber: number

  if (currPage <= 1 && change == -1) {
    newPageNumber = currPage
  } else if (currPage >= maxPages && change == 1) {
    newPageNumber = maxPages
  } else {
    newPageNumber = currPage+change
  }

  const { divisions, currentPage, totalPages } = await divisionDAO.getPaginatedDivisionsByFacility(facilityID, currPage+change, facilityDivisionsPageSize);

  return json({divisions, currentPage, totalPages, success:true});
};