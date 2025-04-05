import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { 
  facilityServicePageSize, 
  facilityUpdateLogsPageSize, 
  facilityAdminsPageSize,
  facilityDivisionsPageSize,

  FacilityServiceListDAO,
  FacilityAdminListDAO,

  UpdateLogDAO, 
  FacilityDivisionListDAO,
  type AdminDTO,
  type DivisionDTO,

} from '$lib';

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityName = cookies.get('facilityName');
  const facilityID = cookies.get('facilityID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions ) {
    throw redirect(303, '/facility');
  }

  const updateLogDAO = new UpdateLogDAO();

  const facilityService = new FacilityServiceListDAO()

  let paginatedServices = await facilityService.getPaginatedServicesByFacility(facilityID, 1, facilityServicePageSize, { updatedAt: "desc" })
  let paginatedUpdateLogs = await updateLogDAO.getPaginatedUpdateLogsByFacility(facilityID, 1, facilityUpdateLogsPageSize, { createdAt: "desc" })

  let toShow
  let admins: AdminDTO[] = [];
  let divisions: DivisionDTO[] = [];


  if (hasAdmins === 'true' ? true : false) {
    const facilityAdminDAO = new FacilityAdminListDAO()
    const paginatedAdmins = await facilityAdminDAO.getPaginatedAdminsByFacility(facilityID, 1, facilityAdminsPageSize, { updatedAt: "desc" })
    admins = paginatedAdmins.results
  }
   if (hasDivisions === 'true' ? true : false) {
    const facilityDivisionsListDAO = new FacilityDivisionListDAO()
    const paginatedDivisions = await facilityDivisionsListDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize, { updatedAt: "desc" })
    divisions = paginatedDivisions.results
  } 

  toShow = {
    mainServicesShown: paginatedServices.results,
    updateLogs: paginatedUpdateLogs.results,
    totalPages: paginatedUpdateLogs.totalPages,
    currentPage: paginatedUpdateLogs.currentPage,

    role,
    hasAdmins: hasAdmins === 'true' ? true : false,
    hasDivisions: hasDivisions === 'true' ? true : false,
    admins, 
    divisions,
    facilityName,
  };
  
  return toShow
};
