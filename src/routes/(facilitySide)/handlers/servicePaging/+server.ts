import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { FacilityServiceListDAO } from '$lib';

const facilityService = new FacilityServiceListDAO()

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');

  if (!facilityID || !employeeID) {
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

  let results, currentPage, totalPages, services

  if (viewedDivisionID === "Default"){
    services = await facilityService.getPaginatedServicesByFacility(facilityID, employeeID, newPageNumber, perPage, { updatedAt: "desc" })
  } else {
    services= await facilityService.getPaginatedServicesByDivision(viewedDivisionID, newPageNumber, perPage, { createdAt: "desc" })
  }
  
  results = services.results
  currentPage = services.currentPage
  totalPages = services.totalPages

  return json({list: results, currentPage, totalPages, success:true});
};