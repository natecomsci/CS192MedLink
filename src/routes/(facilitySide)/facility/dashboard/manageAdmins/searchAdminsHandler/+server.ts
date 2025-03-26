import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { AdminDAO, facilityAdminsPageSize } from '$lib';

const adminDAO = new AdminDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query } : { query: string } = await request.json();

  const { admins } = await adminDAO.employeeSearchAdminsByFacility(facilityID, query, 1, facilityAdminsPageSize);

  return json(admins);
};