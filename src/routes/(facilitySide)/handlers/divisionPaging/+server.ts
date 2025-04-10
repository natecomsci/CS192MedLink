import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { FacilityDivisionListDAO } from '$lib';

const facilityDivisionsListDAO = new FacilityDivisionListDAO()

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const {currPage, change, maxPages, perPage}: {currPage: number, change: number, maxPages: number, perPage:number} = await request.json();

  let newPageNumber: number

  if (currPage <= 1 && change == -1) {
    newPageNumber = currPage
  } else if (currPage >= maxPages && change == 1) {
    newPageNumber = maxPages
  } else {
    newPageNumber = currPage+change
  }

  const { results, currentPage, totalPages } = await facilityDivisionsListDAO.getPaginatedDivisionsByFacility(facilityID, newPageNumber, perPage, { updatedAt: "desc" })

  return json({list: results, currentPage, totalPages, success:true});
};