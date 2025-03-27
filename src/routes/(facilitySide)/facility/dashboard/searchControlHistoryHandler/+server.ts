import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { facilityUpdateLogsPageSize, UpdateLogDAO } from '$lib';

let updateLogDAO = new UpdateLogDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query } : {query: string} = await request.json();
  if (query.length === 0) {
    return json({ 
      error: 'No query',
      description: 'qeury',
      success: false
    });
  }

  const { updateLogs } = await updateLogDAO.employeeSearchUpdateLogsByFacility(facilityID, query, 1, facilityUpdateLogsPageSize);

  if (updateLogs.length === 0) {
    return json({ 
      error: 'No logs found',
      description: 'logs',
      success: false
    });
  }

  return json({updateLogs, success:true});
};