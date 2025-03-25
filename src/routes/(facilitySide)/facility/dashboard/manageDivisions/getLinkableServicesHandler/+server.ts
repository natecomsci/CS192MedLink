import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { DivisionDAO, facilityDivisionsPageSize } from '$lib';

let divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const multiServiceDivisions = await divisionDAO.getMultiServiceDivisions(facilityID);
  console.log(multiServiceDivisions)

  return json(multiServiceDivisions);
};