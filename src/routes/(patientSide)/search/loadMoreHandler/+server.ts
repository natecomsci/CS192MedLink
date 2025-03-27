import type { RequestHandler } from '@sveltejs/kit';
import { fail, json, redirect } from '@sveltejs/kit';

import { FacilityDAO, patientSearchPageSize, ServicesDAO } from '$lib';

const facilityDAO = new FacilityDAO();
const serviceDAO = new ServicesDAO(); 

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { activeTab, currOffset, query } : { activeTab: string, currOffset: number, query: string } = await request.json();

  if (activeTab === "facility") {
    const byFacilities = await facilityDAO.patientSearch(query, patientSearchPageSize, currOffset);
    return json({results: byFacilities.results, hasMore: byFacilities.hasMore})
  } else if (activeTab === "service") {
    const byService = await serviceDAO.patientSearch(query, patientSearchPageSize, currOffset);
    return json({results: byService.results, hasMore: byService.hasMore})
  } else {
    return json({results:[], hasMore: false})
  }
};