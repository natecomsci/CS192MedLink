import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { facilityUpdateLogsPageSize, UpdateLogDAO } from '$lib';

let updateLogDAO = new UpdateLogDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query } : {query: string} = await request.json();

  const { updateLogs } = await updateLogDAO.employeeSearchUpdateLogsByFacility(facilityID, query, 1, facilityUpdateLogsPageSize);

  return json(updateLogs);
};