import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { DivisionDAO } from '$lib';

const divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { divisionID } : { divisionID: string } = await request.json();

  let {
    divisionName,
    phoneNumber,
    openingTime,
    closingTime,
  } = await divisionDAO.getInformation(divisionID);

  return json({
    divisionName,
    phoneNumber,
    openingTime,
    closingTime
  })
};