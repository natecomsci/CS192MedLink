import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { 
  facilityServicePageSize, 
  facilityUpdateLogsPageSize, 
  facilityAdminsPageSize,
  facilityDivisionsPageSize,

  UpdateLogDAO, 
  ServicesDAO, 
  AdminDAO,
  DivisionDAO,
  type AdminDTO,
  type DivisionDTO,

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

  let toShow
  let admins: AdminDTO[] = [];
  let divisions: DivisionDTO[] = [];


  if (Boolean(hasAdmins)) {
    const adminDAO = new AdminDAO
    const paginatedAdmins = await adminDAO.getPaginatedAdminsByFacility(facilityID, 1, facilityAdminsPageSize)
    admins = paginatedAdmins.admins
  }
   if (Boolean(hasDivisions)) {
    const divisionsDAO = new DivisionDAO
    const paginatedDivisions = await divisionsDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize)
    divisions = paginatedDivisions.divisions
  } 

  toShow = {
    mainServicesShown: paginatedServices.services,
    updateLogs: paginatedUpdateLogs.updateLogs,
    totalPages: paginatedUpdateLogs.totalPages,
    currentPage: paginatedUpdateLogs.currentPage,

    role,
    hasAdmins: Boolean(hasAdmins),
    hasDivisions: Boolean(hasDivisions),
    admins, 
    divisions,
  };
  
  return toShow
};
