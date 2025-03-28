import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { UpdateLogDAO, facilityUpdateLogsPageSize } from '$lib';

const updateLogDAO = new UpdateLogDAO();

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

  let { updateLogs, currentPage, totalPages } = await updateLogDAO.getPaginatedUpdateLogsByFacility(facilityID, newPageNumber, facilityUpdateLogsPageSize)

  return json({updateLogs, currentPage, totalPages, success:true});
};