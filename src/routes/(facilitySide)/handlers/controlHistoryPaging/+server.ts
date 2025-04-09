import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { UpdateLogDAO } from '$lib';
import type { Role } from '@prisma/client';

const updateLogDAO = new UpdateLogDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');
  const role = cookies.get('role');

  if (!facilityID || !role || !employeeID) {
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

  let results, currentPage, totalPages, logs

  if (viewedDivisionID === "Default"){
    logs = await updateLogDAO.getPaginatedUpdateLogsByFacility(facilityID, employeeID, role as Role, newPageNumber, perPage, { createdAt: "desc" })
  } else {
    logs= await updateLogDAO.getPaginatedUpdateLogsByDivision(viewedDivisionID, newPageNumber, perPage, { createdAt: "desc" })
  }
  
  results = logs.results
  currentPage = logs.currentPage
  totalPages = logs.totalPages

  return json({list: results, currentPage, totalPages, success:true});
};