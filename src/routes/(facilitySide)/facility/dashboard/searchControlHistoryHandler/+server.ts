import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { facilityUpdateLogsPageSize, UpdateLogDAO } from '$lib';

let updateLogDAO = new UpdateLogDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
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

  const { updateLogs, currentPage, totalPages } = await updateLogDAO.employeeSearchUpdateLogsByFacility(facilityID, query, newPageNumber, facilityUpdateLogsPageSize);

  if (updateLogs.length === 0) {
    return json({ 
      error: 'No logs found',
      description: 'logs',
      success: false
    });
  }

  return json({updateLogs, currentPage, totalPages, success:true});
};