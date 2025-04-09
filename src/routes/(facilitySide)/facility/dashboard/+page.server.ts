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

} from '$lib';
import { Role } from '@prisma/client';

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityName = cookies.get('facilityName');
  const facilityID = cookies.get('facilityID');
  const employeeID = cookies.get('employeeID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');

  if (!facilityID || !role || !hasAdmins || !hasDivisions || !employeeID) {
    throw redirect(303, '/facility');
  }

  const updateLogDAO = new UpdateLogDAO();

  const facilityService = new FacilityServiceListDAO()

  let paginatedServices = await facilityService.getPaginatedServicesByFacility(facilityID, employeeID, role as Role, 1, facilityServicePageSize, { updatedAt: "desc" })
  let paginatedUpdateLogs = await updateLogDAO.getPaginatedUpdateLogsByFacility(facilityID, employeeID, role as Role, 1, facilityUpdateLogsPageSize, { createdAt: "desc" })

  let toShow
  let admins: AdminDTO[] = [];
  let divisions = [];

  if (hasAdmins === 'true' ? true : false && role == Role.MANAGER) {
    const facilityAdminDAO = new FacilityAdminListDAO()
    const paginatedAdmins = await facilityAdminDAO.getPaginatedAdminsByFacility(facilityID, 1, facilityAdminsPageSize, { updatedAt: "desc" })
    admins = paginatedAdmins.results
  }
  
  if (hasDivisions === 'true' ? true : false) {
    if (role == Role.MANAGER){
      const facilityDivisionsListDAO = new FacilityDivisionListDAO()
      const paginatedDivisions = await facilityDivisionsListDAO.getPaginatedDivisionsByFacility(facilityID, 1, facilityDivisionsPageSize, { updatedAt: "desc" })
      divisions = paginatedDivisions.results
    } else {
      const adminDAO = new AdminDAO()
      const paginatedDivisions = await adminDAO.getDivisions(employeeID)
      divisions = paginatedDivisions
    }
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
