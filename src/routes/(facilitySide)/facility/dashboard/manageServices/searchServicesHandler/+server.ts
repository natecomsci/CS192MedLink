import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { ServicesDAO, facilityServicePageSize } from '$lib/index';

let servicesDAO: ServicesDAO = new ServicesDAO();

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { query, currPage, change, maxPages }: { query: string, currPage: number, change: number, maxPages: number} = await request.json();

  if (query.length === 0) {
    return json({ 
      error: 'No query',
      description: 'qeury',
      success: false
    });
  }

  let newPageNumber: number

  if (currPage <= 1 && change == -1) {
    newPageNumber = currPage
  } else if (currPage >= maxPages && change == 1) {
    newPageNumber = maxPages
  } else {
    newPageNumber = currPage+change
  }

  const { services, currentPage, totalPages } = await servicesDAO.employeeSearchServicesByFacility(facilityID, query, newPageNumber, facilityServicePageSize);

  if (services.length === 0) {
    return json({ 
      error: 'No services found',
      description: 'services',
      success: false
    });
  }

  return json({services, currentPage, totalPages, success:true});
};