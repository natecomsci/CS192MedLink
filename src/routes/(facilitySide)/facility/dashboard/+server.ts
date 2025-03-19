import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { ServicesDAO } from '$lib/server/ServicesDAO';
import { facilityServicePageSize } from '$lib/index';

let servicesDAO: ServicesDAO = new ServicesDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  // location is of type RegionDTO | POrCDTO | COrMDTO
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

  const { services } = await servicesDAO.getPaginatedServices(facilityID, newPageNumber, facilityServicePageSize);

  return json(services);
};