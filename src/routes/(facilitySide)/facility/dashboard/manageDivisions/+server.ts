import { json, redirect, type RequestHandler } from '@sveltejs/kit';
import { DivisionDAO, FacilityAdminListDAO, ServicesDAO } from '$lib';

const facilityAdminListDAO = new FacilityAdminListDAO()
const servicesDAO = new ServicesDAO()
const divisionDAO = new DivisionDAO()

export const POST: RequestHandler = async ({ request, cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  const { divisionID } : { divisionID: string } = await request.json();
  console.log(divisionID)

  const divisionAdmins = await facilityAdminListDAO.getSingleDivisionAdmins(facilityID)
  const facilityDivisions = await divisionDAO.getByFacility(facilityID)
  const divisionServices = await servicesDAO.getByDivision(divisionID)

  console.log(divisionAdmins.filter(d => (d.divisions ?? [{divisionID:''}])[0].divisionID === divisionID))

  return json({
    admins: divisionAdmins.filter(d => (d.divisions ?? [{divisionID:''}])[0].divisionID === divisionID),
    divisions: facilityDivisions.filter(d => d.divisionID != divisionID),
    services: divisionServices,
  })
};