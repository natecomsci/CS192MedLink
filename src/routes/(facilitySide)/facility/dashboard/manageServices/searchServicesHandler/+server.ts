import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { ServicesDAO } from '$lib/server/ServicesDAO';
import { facilityServicePageSize } from '$lib/index';

let servicesDAO: ServicesDAO = new ServicesDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query } : { query: string } = await request.json();
  if (query.length === 0) {
    return json({ 
      error: 'No query',
      description: 'qeury',
      success: false
    });
  }

  const { services } = await servicesDAO.employeeSearchServicesByFacility(facilityID, query, 1, facilityServicePageSize);

  if (services.length === 0) {
    return json({ 
      error: 'No services found',
      description: 'services',
      success: false
    });
  }

  return json({services, success:true});
};