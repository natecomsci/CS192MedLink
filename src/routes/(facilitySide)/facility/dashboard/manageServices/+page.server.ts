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
import { ServicesDAO } from '$lib/server/ServicesDAO';

const ambulanceDAO = new AmbulanceServiceDAO();
const bloodBankDAO = new BloodBankServiceDAO();
const ERDAO = new ERServiceDAO();
const ICUDAO = new ICUServiceDAO();
const OutpatientDAO = new OutpatientServiceDAO();
const facilityDAO = new FacilityDAO(); // DAO for retrieving facility data

export const load: PageServerLoad = async ({ cookies }) => {
  const servicesDAO = new ServicesDAO();
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }

  let services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);

  services.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) {
      return -1;
    }
    if (a.updatedAt > b.updatedAt) {
      return 1;
    }
    return 0;
  });

  const servicesObj: ServiceDTO[] = services;
  
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

    const facilityID = cookies.get('facilityID');
    if (!facilityID) {
      throw redirect(303, '/facility');
    }
    
    if (!serviceID || !serviceType || !password) {
      return fail(422, { 
        error: "Service ID, type, and password are required",
        description: "missing_params",
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
      return fail(500, { 
        error: "Failed to delete service",
        description: "database",
        success: false  
      });
    }

    return {
      success: true
    }
  }
};
