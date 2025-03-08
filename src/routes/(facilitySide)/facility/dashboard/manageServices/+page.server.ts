import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { ServiceDTO } from '$lib/server/DTOs';

import { AmbulanceServiceDAO } from "$lib/server/AmbulanceDAO";
import { BloodBankServiceDAO } from "$lib/server/BloodBankDAO";
import { ERServiceDAO } from "$lib/server/ERDAO";
import { ICUServiceDAO } from "$lib/server/ICUDAO";
import { OutpatientServiceDAO } from "$lib/server/OutpatientDAO";


const ambulanceDAO = new AmbulanceServiceDAO()
const bloodBankDAO = new BloodBankServiceDAO()
const ERDAO = new ERServiceDAO()
const ICUDAO = new ICUServiceDAO()
const OutpatientDAO = new OutpatientServiceDAO()

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

    if (!serviceID || !serviceType) {
      return fail(422, { 
        error: "Service ID and type are required",
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
          return fail(400, { 
            error: "Unknown service type",
            description: "invalid_service_type",
            success: false  
          });
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
