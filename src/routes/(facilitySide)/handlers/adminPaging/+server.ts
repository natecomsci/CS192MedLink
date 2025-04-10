import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { FacilityAdminListDAO } from '$lib';

const facilityAdminDAO = new FacilityAdminListDAO()

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const {currPage, change, maxPages, perPage, viewedDivisionID}: {currPage: number, change: number, maxPages: number, perPage:number, viewedDivisionID:string} = await request.json();

  let newPageNumber: number

  if (currPage <= 1 && change == -1) {
    newPageNumber = currPage
  } else if (currPage >= maxPages && change == 1) {
    newPageNumber = maxPages
  } else {
    newPageNumber = currPage+change
  }

  let results, currentPage, totalPages, admins

  if (viewedDivisionID === "Default"){
    admins = await facilityAdminDAO.getPaginatedAdminsByFacility(facilityID, newPageNumber, perPage, { updatedAt: "desc" })
  } else {
    admins= await facilityAdminDAO.getPaginatedAdminsByDivision(viewedDivisionID, newPageNumber, perPage, { createdAt: "desc" })
  }
  
  results = admins.results
  currentPage = admins.currentPage
  totalPages = admins.totalPages


  return json({list: results, currentPage, totalPages, success:true});
};