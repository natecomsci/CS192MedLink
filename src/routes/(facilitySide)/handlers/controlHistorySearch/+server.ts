import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { facilityUpdateLogsPageSize, UpdateLogDAO } from '$lib';
import type { Role } from '@prisma/client';

let updateLogDAO = new UpdateLogDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');
  const role = cookies.get('role');

  if (!facilityID || !role || !employeeID) {
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

  const { results, currentPage, totalPages } = await updateLogDAO.employeeSearchUpdateLogsByFacility(facilityID, employeeID, role as Role, query, newPageNumber, facilityUpdateLogsPageSize, { createdAt: "desc" });

  if (results.length === 0) {
    return json({ 
      error: 'No logs found',
      description: 'logs',
      success: false
    });
  }

  return json({list: results, currentPage, totalPages, success:true});
};