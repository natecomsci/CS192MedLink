import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { FacilityServiceListDAO, facilityServicePageSize } from '$lib';
import type { Role } from '@prisma/client';

let facilityServiceDAO = new FacilityServiceListDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');
  const role = cookies.get('role');

  if (!facilityID || !role || !employeeID) {
    throw redirect(303, '/facility');
  }

  const { query, currPage, change, maxPages, perPage, viewedDivisionID }: { query: string, currPage: number, change: number, maxPages: number, perPage:number, viewedDivisionID:string} = await request.json();

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

  // const { results, currentPage, totalPages } = await facilityServiceDAO.employeeSearchServicesByFacility(facilityID, employeeID, role as Role, query, newPageNumber, facilityServicePageSize, { updatedAt: "desc" });

  let results, currentPage, totalPages, services

  if (viewedDivisionID === "Default"){
    services = await facilityServiceDAO.employeeSearchServicesByFacility(facilityID, employeeID, role as Role, query, newPageNumber, facilityServicePageSize, { updatedAt: "desc" });
  } else {
    services= await facilityServiceDAO.employeeSearchServicesByDivision(viewedDivisionID, query, newPageNumber, perPage, { createdAt: "desc" })
  }
  
  results = services.results
  currentPage = services.currentPage
  totalPages = services.totalPages

  if (results.length === 0) {
    return json({ 
      error: 'No services found',
      description: 'services',
      success: false
    });
  }

  return json({list: results, currentPage, totalPages, success:true});
};