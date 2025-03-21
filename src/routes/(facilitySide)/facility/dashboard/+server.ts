import { json, redirect, type RequestHandler } from '@sveltejs/kit';

import { ServicesDAO, facilityServicePageSize } from '$lib';

let servicesDAO: ServicesDAO = new ServicesDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const {currPage, change, maxPages} : {currPage: number, change: number, maxPages: number} = await request.json();

  let newPageNumber: number

  if (currPage === 1 && change === -1) {
    newPageNumber = currPage
  } else if (currPage === maxPages && change === 1) {
    newPageNumber = maxPages
  } else {
    newPageNumber = currPage+change
  }

  const { services } = await servicesDAO.getPaginatedServicesByFacility(facilityID, newPageNumber, facilityServicePageSize);

  return json(services);
};