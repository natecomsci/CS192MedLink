import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { 
  facilityServicePageSize, 
  facilityUpdateLogsPageSize, 
  UpdateLogDAO, 
  ServicesDAO, 
  AdminDAO,
  facilityAdminsPageSize
} from '$lib';

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions ) {
    throw redirect(303, '/facility');
  }

  const servicesDAO = new ServicesDAO();
  const updateLogDAO = new UpdateLogDAO();

  let paginatedServices = await servicesDAO.getPaginatedServicesByFacility(facilityID, 1, facilityServicePageSize)
  let paginatedUpdateLogs = await updateLogDAO.getPaginatedUpdateLogsByFacility(facilityID, 1, facilityUpdateLogsPageSize)

  let toShow = {
    mainServicesShown: paginatedServices.services,
    updateLogs: paginatedUpdateLogs.updateLogs,
    totalPages: paginatedUpdateLogs.totalPages,
    currentPage: paginatedUpdateLogs.currentPage,
    hasAdmins: Boolean(hasAdmins),
    hasDivisions: Boolean(hasDivisions),
  };

  if (toShow.hasAdmins) {
    const adminDAO = new AdminDAO
    const admins = adminDAO.getPaginatedAdminsByFacility(facilityID, 1, facilityAdminsPageSize)
    Object.defineProperty(toShow, "admins", {value: admins})
  }

  if (toShow.hasDivisions) {
    // const divisionsDAO = new DivisionsDAO
    // const divisions = divisionsDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize)
    // Object.defineProperty(toShow, "divisionsDAO", {value: divisionsDAO})
  }
  
  return toShow
};
