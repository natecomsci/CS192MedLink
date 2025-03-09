import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import type { CreateAmbulanceServiceDTO, 
              CreateBloodBankServiceDTO, 
              CreateERServiceDTO, 
              CreateICUServiceDTO, 
              CreateOutpatientServiceDTO,
              ServiceDTO, 
               
            } from '$lib/server/DTOs';

import { validateCoverageRadius, 
         validateFloat, 
         validateOperatingHours, 
         validatePhone, 
         validateCompletionTime 
       } from '$lib/server/formValidators';

import { AmbulanceServiceDAO } from "$lib/server/AmbulanceDAO";
import { BloodBankServiceDAO } from "$lib/server/BloodBankDAO";
import { ERServiceDAO } from "$lib/server/ERDAO";
import { ICUServiceDAO } from "$lib/server/ICUDAO";
import { OutpatientServiceDAO } from "$lib/server/OutpatientDAO";
import { serviceNameToNameMapping } from '$lib/Mappings';

import { OPServiceTypes, specializedServiceType, type OPServiceType } from '$lib/projectArrays';
import { ServicesDAO } from '$lib/server/ServicesDAO';

export const load: PageServerLoad = async ({ cookies }) => {
  const serviceDAO = new ServicesDAO();
  const facilityID = cookies.get('facilityID'); 

  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  const services: ServiceDTO[] = await serviceDAO.getByFacility(facilityID);

  let serviceTypes: OPServiceType[] = services.map(s => s.type);

  let availableServices: String[] = getAvailableSpecializedServices(serviceTypes)
  let availableOPServices: String[] = getAvailableOPServices(serviceTypes)

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
  }

  return {
    availableServices,
    availableOPServices
  };
};

export const actions = {
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
      return fail(422, { 
        error: "Facility not signed in.",
        description: "facility",
        success: false  
      });
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
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          let OCTime = validateOperatingHours(open, close)
          openingTime = OCTime.openingTime
          closingTime = OCTime.closingTime
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "openClose",
            success: false
          });
        }

        try {
          let radius = validateCoverageRadius(minCover, maxCover)
          minCoverageRadius = radius.minCoverageRadius
          maxCoverageRadius = radius.maxCoverageRadius
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "coverage",
            success: false
          });
        }

        try {
          baseRate = validateFloat(rates, "Base Rate");
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        try {
          mileageRate = validateFloat(mileRate, "Mileage Rate");
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "mileRate",
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
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          let OCTime = validateOperatingHours(open, close)
          openingTime = OCTime.openingTime
          closingTime = OCTime.closingTime
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "openClose",
            success: false
          });
        }

        try {
          pricePerUnit = validateFloat(rates, "Price Per Unit");
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        try {
          let TTime = validateCompletionTime(turnTD, turnTH, "Turnarond")
          turnaroundTimeD = TTime.days
          turnaroundTimeH = TTime.hours
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "turnaround",
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
            description: "phoneNumber",
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
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          baseRate = validateFloat(rates, "Base Rate");
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "price",
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
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        try {
          let CTime = validateCompletionTime(compTD, compTH, "Completion")
          completionTimeD = CTime.days
          completionTimeH = CTime.hours
        } catch (error) {
          return fail(422, {
            error: (error as Error).message,
            description: "completion",
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

    return { success: true };
  }
} satisfies Actions;

function getAvailableSpecializedServices(serviceTypes: OPServiceType[]): String[] {
  let availableServices: String[] = ["None"]
  
  for (let serviceType of specializedServiceType) { 
    if (!serviceTypes.includes(serviceType)) {
      // availableServices.push(serviceNameToNameMapping[serviceType])
      availableServices.push(serviceType);
    }
  }
  console.log('main', availableServices)
  return availableServices
}


function getAvailableOPServices(serviceTypes: OPServiceType[]): String[] {
  let availableOPServices: String[] = ["None"]
  
  for (let serviceType of OPServiceTypes) { 
    if (!serviceTypes.includes(serviceType)) {
      // availableOPServices.push(serviceNameToNameMapping[serviceType])
      availableOPServices.push(serviceType)
    }
  }
  console.log('op', availableOPServices)

  return availableOPServices;
}
