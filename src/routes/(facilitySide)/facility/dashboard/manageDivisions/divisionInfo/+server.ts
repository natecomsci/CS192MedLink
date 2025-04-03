import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { dateToTimeMapping, DivisionDAO } from '$lib';

const divisionDAO = new DivisionDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { divisionID } : { divisionID: string } = await request.json();
  console.log(divisionID)

  let division = await divisionDAO.getInformation(divisionID);
  
  return json({
    name: division.name,
    phoneNumber: division.phoneNumber,
    openingTime: dateToTimeMapping(division.openingTime),
    closingTime: dateToTimeMapping(division.closingTime),
    ...(division.email ? { email: division.email } : {}),
  })
};