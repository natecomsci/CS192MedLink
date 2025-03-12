import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { ServiceDTO } from '$lib/server/DTOs';
import bcrypt from 'bcryptjs';
import { AmbulanceServiceDAO } from "$lib/server/AmbulanceDAO";
import { BloodBankServiceDAO } from "$lib/server/BloodBankDAO";
import { ERServiceDAO } from "$lib/server/ERDAO";
import { ICUServiceDAO } from "$lib/server/ICUDAO";
import { OutpatientServiceDAO } from "$lib/server/OutpatientDAO";
import { FacilityDAO } from "$lib/server/FacilityDAO"; // Assuming this exists to get facility info

const ambulanceDAO = new AmbulanceServiceDAO();
const bloodBankDAO = new BloodBankServiceDAO();
const ERDAO = new ERServiceDAO();
const ICUDAO = new ICUServiceDAO();
const OutpatientDAO = new OutpatientServiceDAO();
const facilityDAO = new FacilityDAO(); // DAO for retrieving facility data

export const load: PageServerLoad = async ({ cookies }) => {
  let services = cookies.get("services");

  if (!services) {
    return fail(422, {
      error: "Account has no services",
      description: "service"
    });
  }

  const servicesObj: ServiceDTO[] = JSON.parse(services);
  
  return {
    servicesObj
  };
};

export const actions: Actions = {
  deleteService: async ({ request, cookies }) => {
    const formData = await request.formData();
    const serviceID = formData.get("serviceID") as string;
    const serviceType = formData.get("serviceType") as string;
    const password = formData.get("password") as string; // Get password from form

    if (!serviceID || !serviceType || !password) {
      return fail(422, { 
        error: "Service ID, type, and password are required",
        description: "missing_params",
        success: false  
      });
    }

    const facilityID = cookies.get('facilityID');
    if (!facilityID) {
      return fail(422, { 
        error: "Facility not signed in.",
        description: "facility",
        success: false  
      });
    }

    try {
      // Fetch facility data from DB
      const facility = await facilityDAO.getByID(facilityID);
      if (!facility) {
        console.error(`Facility with ID ${facilityID} not found.`);
        return fail(404, { 
          error: "Facility not found",
          description: "not_found",
          success: false  
        });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, facility.password);
      if (!passwordMatch) {
        console.error(`Incorrect password attempt for Facility ID: ${facilityID}`);
        return fail(400, { 
          error: 'Incorrect ID-password pair',
          description: 'pass',
          success: false
        });
      }

      // Delete service based on type
      switch (serviceType) {
        case "Ambulance":
          await ambulanceDAO.delete(serviceID);
          break;
        case "Blood Bank":
          await bloodBankDAO.delete(serviceID);
          break;
        case "Emergency Room":
          await ERDAO.delete(serviceID);
          break;
        case "Intensive Care Unit":
          await ICUDAO.delete(serviceID);
          break;
        default:
          await OutpatientDAO.delete(serviceID);
          break;
      }

    } catch (error) {
      console.error("Deletion failed:", error);
      return fail(500, { 
        error: "Failed to delete service",
        description: "database",
        success: false  
      });
    }

    throw redirect(303, '/facility/dashboard/manageServices');
  }
};
