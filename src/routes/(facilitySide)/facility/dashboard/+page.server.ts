import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { ServicesDAO } from '$lib/server/ServicesDAO';
import { facilityServicePageSize } from '$lib/index';

export const load: PageServerLoad = async ({ cookies }) => {
  const servicesDAO = new ServicesDAO();
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  let paginatedServices = await servicesDAO.getPaginatedServicesByFacility(facilityID, 1, facilityServicePageSize)
  
  return {
    services: paginatedServices.services,
    totalPages: paginatedServices.totalPages,
    currentPage: paginatedServices.currentPage
  };
};
