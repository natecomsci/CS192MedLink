import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { AdminDAO } from '$lib';

const adminDAO = new AdminDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { adminID } : { adminID: string } = await request.json();

  let adminInfo = await adminDAO.getInformation(adminID);

  console.log(adminInfo)

  return json(adminInfo)
};