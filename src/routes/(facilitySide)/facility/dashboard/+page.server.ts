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
  AdminDAO,
  type PaginatedResultsDTO,
  type DivisionDTO,

} from '$lib';
import { Role } from '@prisma/client';

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityName = cookies.get('facilityName');
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityName || !facilityID || !role || !hasAdmins || !hasDivisions || !employeeID) {
    throw redirect(303, '/facility');
  }

  const updateLogDAO = new UpdateLogDAO();

  const facilityService = new FacilityServiceListDAO()

  let paginatedServices = await facilityService.getPaginatedServicesByFacility(facilityID, employeeID, 1, facilityServicePageSize, { updatedAt: "desc" })
  let paginatedUpdateLogs = await updateLogDAO.getPaginatedUpdateLogsByFacility(facilityID, employeeID, 1, facilityUpdateLogsPageSize, { createdAt: "desc" })

  let admins: AdminDTO[] = [];
  let divisions: DivisionDTO[] = [];

  if (role == Role.MANAGER){
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
  }

  return {
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
};
