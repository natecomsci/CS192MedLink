import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from 'bcryptjs';

import type { CreateAmbulanceServiceDTO, 
              CreateBloodBankServiceDTO, 
              CreateERServiceDTO, 
              CreateICUServiceDTO, 
              CreateOutpatientServiceDTO, 
              ServiceDTO } from '$lib/server/DTOs';

import { facilityServicePageSize } from '$lib/globalVariables';
import { OPServiceTypes, specializedServiceType, type OPServiceType } from '$lib/projectArrays';

import { AmbulanceServiceDAO } from "$lib/server/AmbulanceDAO";
import { BloodBankServiceDAO } from "$lib/server/BloodBankDAO";
import { ERServiceDAO } from "$lib/server/ERDAO";
import { ICUServiceDAO } from "$lib/server/ICUDAO";
import { OutpatientServiceDAO } from "$lib/server/OutpatientDAO";
import { FacilityDAO } from "$lib/server/FacilityDAO";
import { ServicesDAO } from '$lib/server/ServicesDAO';

import { validateCompletionTime, validateCoverageRadius, validateFloat, validateOperatingHours, validatePhone } from '$lib/server/formValidators';

const ambulanceDAO = new AmbulanceServiceDAO();
const bloodBankDAO = new BloodBankServiceDAO();
const eRDAO = new ERServiceDAO();
const iCUDAO = new ICUServiceDAO();
const outpatientDAO = new OutpatientServiceDAO();
const facilityDAO = new FacilityDAO();

let selectedService: ServiceDTO

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    throw redirect(303, '/facility');
  }
  
  const servicesDAO = new ServicesDAO();

  let paginatedServices = await servicesDAO.getPaginatedServices(facilityID, 1, facilityServicePageSize)

  const services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);
  let serviceTypes: OPServiceType[] = services.map(s => s.type);

  let availableServices: String[] = getAvailableSpecializedServices(serviceTypes)
  let availableOPServices: String[] = getAvailableOPServices(serviceTypes)

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
  }

  return {
    // Paginated Services
    services: paginatedServices.services,
    totalPages: paginatedServices.totalPages,
    currentPage: paginatedServices.currentPage,

    // Add Service Lists
    availableServices,
    availableOPServices,

  };
};

export const actions: Actions = {
  deleteService: async ({ request, cookies }) => {
    const facilityID = cookies.get('facilityID');
    if (!facilityID) {
      throw redirect(303, '/facility');
    }

    const formData = await request.formData();

    const serviceID = formData.get("serviceID") as string;
    const serviceType = formData.get("serviceType") as string;
    const password = formData.get("password") as string; // Get password from confirmation

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
          await eRDAO.delete(serviceID);
          break;
        case "Intensive Care Unit":
          await iCUDAO.delete(serviceID);
          break;
        default:
          await outpatientDAO.delete(serviceID);
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
  },
  addService: async ({ cookies, request }) => {
    const data = await request.formData();

    const serviceType = data.get('serviceType');

    const phone    = data.get('phoneNumber');
    const open     = data.get('opening');
    const close    = data.get('closing');
    const rates    = data.get('price');
    const minCover = data.get('minCoverageRadius');
    const mileRate = data.get('mileageRate');
    const maxCover = data.get('maxCoverageRadius');


    const turnTD  = data.get('turnaroundDays');
    const turnTH  = data.get('turnaroundHours');


    const OPType  = data.get('OPserviceType');
    const compTD  = data.get('completionDays');
    const compTH  = data.get('completionHours');
    const walkins = data.get('acceptWalkins');
    

    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      throw redirect(303, '/facility');
    }
    
    switch (serviceType){
      case "Ambulance": {
        let phoneNumber: string
        let openingTime: Date
        let closingTime: Date
        let baseRate: number
        let minCoverageRadius: number
        let mileageRate: number
        let maxCoverageRadius: number

        try {
          phoneNumber = validatePhone(phone);
          baseRate = validateFloat(rates, "Base Rate");
          mileageRate = validateFloat(mileRate, "Mileage Rate");

          let OCTime = validateOperatingHours(open, close)
          openingTime = OCTime.openingTime
          closingTime = OCTime.closingTime

          let radius = validateCoverageRadius(minCover, maxCover)
          minCoverageRadius = radius.minCoverageRadius
          maxCoverageRadius = radius.maxCoverageRadius

        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const service: CreateAmbulanceServiceDTO = {
          phoneNumber,
          openingTime,
          closingTime,
          baseRate,
          minCoverageRadius,
          mileageRate,
          maxCoverageRadius
        }

        const dao = new AmbulanceServiceDAO();

        dao.create(facilityID, service)
        break;
      }

      case "Blood Bank": {
        let phoneNumber: string
        let openingTime: Date
        let closingTime: Date
        let pricePerUnit: number
        let turnaroundTimeD: number
        let turnaroundTimeH: number

        try {
          phoneNumber = validatePhone(phone);
          pricePerUnit = validateFloat(rates, "Price Per Unit");

          let OCTime = validateOperatingHours(open, close)
          openingTime = OCTime.openingTime
          closingTime = OCTime.closingTime

          let TTime = validateCompletionTime(turnTD, turnTH, "Turnarond")
          turnaroundTimeD = TTime.days
          turnaroundTimeH = TTime.hours
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const service: CreateBloodBankServiceDTO = {
          phoneNumber,
          openingTime,
          closingTime,
          pricePerUnit,
          turnaroundTimeD,
          turnaroundTimeH
        }

        const dao = new BloodBankServiceDAO();

        dao.create(facilityID, service)
        break;
      }

      case "Emergency Room": {
        let phoneNumber: string

        try {
          phoneNumber = validatePhone(phone);
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const service: CreateERServiceDTO = {
          phoneNumber
        }

        const dao = new ERServiceDAO();

        dao.create(facilityID, service)
        break;
      }

      case "Intensive Care Unit": {
        let phoneNumber: string
        let baseRate: number

        try {
          phoneNumber = validatePhone(phone);
          baseRate = validateFloat(rates, "Base Rate");
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const service: CreateICUServiceDTO = {
          phoneNumber,
          baseRate
        }

        const dao = new ICUServiceDAO();

        dao.create(facilityID, service)
        break;
      }

      case "Outpatient": {
        let price: number
        let completionTimeD: number
        let completionTimeH: number

        const OPserviceType     = OPType as string;
        const acceptsWalkIns    = walkins === 'on';

        try {
          price = validateFloat(rates, "Price");
        
          let CTime = validateCompletionTime(compTD, compTH, "Completion")
          completionTimeD = CTime.days
          completionTimeH = CTime.hours
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "validation",
            success: false
          });
        }

        const service: CreateOutpatientServiceDTO = {
          serviceType: OPserviceType,
          price,
          completionTimeD,
          completionTimeH,
          acceptsWalkIns
        }

        const dao = new OutpatientServiceDAO();

        dao.create(facilityID, service)
        break;
      }

      default: {
        return fail(422, { 
          error: "No service type selected", 
          description: "serviceType",
          success: false
        });
      }
    }

    return {
      success: true
    }
  },
};


function getAvailableSpecializedServices(serviceTypes: OPServiceType[]): String[] {
  let availableServices: String[] = ["None"]
  
  for (let serviceType of specializedServiceType) { 
    if (!serviceTypes.includes(serviceType)) {
      availableServices.push(serviceType);
    }
  }
  return availableServices
}

function getAvailableOPServices(serviceTypes: OPServiceType[]): String[] {
  let availableOPServices: String[] = ["None"]
  
  for (let serviceType of OPServiceTypes) { 
    if (!serviceTypes.includes(serviceType)) {
      availableOPServices.push(serviceType)
    }
  }
  return availableOPServices;
}

