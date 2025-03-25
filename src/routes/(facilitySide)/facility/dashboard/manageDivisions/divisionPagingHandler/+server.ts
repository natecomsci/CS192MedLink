import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { DivisionDAO, facilityDivisionsPageSize } from '$lib';

let divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const {currPage, change} : {currPage: number, change: number} = await request.json();

  const { divisions } = await divisionDAO.getPaginatedDivisionsByFacility(facilityID, currPage+change, facilityDivisionsPageSize);

  return json(divisions);
};