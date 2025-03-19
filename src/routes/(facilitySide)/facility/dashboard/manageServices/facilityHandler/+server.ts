import type { RequestHandler } from '@sveltejs/kit';
import { json, redirect } from '@sveltejs/kit';
import { ServicesDAO } from '$lib/server/ServicesDAO';
import { facilityServicePageSize } from '$lib/index';

let servicesDAO: ServicesDAO = new ServicesDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const {currPage, change} : {currPage: number, change: number} = await request.json();

  const { services } = await servicesDAO.getPaginatedServices(facilityID, currPage+change, facilityServicePageSize);

  return json(services);
};