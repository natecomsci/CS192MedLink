import { fail } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from '$lib/server/dtos';
import { ServiceType } from '@prisma/client';
import { validateCoverageRadius, validateOpenClose, validatePhone, validateTurnaroundCompletionTime } from '$lib/server/formValidators';
import { AmbulanceServiceDAO, BloodBankServiceDAO, ERServiceDAO, ICUServiceDAO, OutpatientServiceDAO } from '$lib/server/prisma';

export const actions = {
  create: async ({ cookies, request }) => {
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
        try {
          const phoneNumber       = validatePhone(phone);
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          const { openingTime, closingTime }   = validateOpenClose(open, close)
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "openClose",
            success: false
          });
        }
        
        const baseRate          = Number(rates);
        
        const mileageRate       = Number(mileRate);
        
        try {
          const { minCoverageRadius, maxCoverageRadius } = validateCoverageRadius(minCover, maxCover)

        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "coverage",
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
        console.log(service);

        const dao = new AmbulanceServiceDAO();

        // dao.create(facilityID, service)
        break;
      }
      case "Blood Bank": {
        try {
          const phoneNumber       = validatePhone(phone);
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          const { openingTime, closingTime }   = validateOpenClose(open, close)
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "openClose",
            success: false
          });
        }

        try {
          const TTime              = validateTurnaroundCompletionTime(turnTD, turnTH)
          const turnaroundTimeD   = TTime.days;
          const turnaroundTimeH   = TTime.hours; 
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "turnaround",
            success: false
          });
        }

        const pricePerUnit      = Number(rates);
        
        const service: CreateBloodBankServiceDTO = {
          phoneNumber,
          openingTime,
          closingTime,
          pricePerUnit,
          turnaroundTimeD,
          turnaroundTimeH
        }
        console.log(service);

        const dao = new BloodBankServiceDAO();

        // dao.create(facilityID, service)
        break;
      }
      case "Emergency Room": {
        try {
          const phoneNumber       = validatePhone(phone);
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        const service: CreateERServiceDTO = {
          phoneNumber
        }
        console.log(service);

        const dao = new ERServiceDAO();

        // dao.create(facilityID, service)
        break;
      }
      case "ICU": {
        try {
          const phoneNumber       = validatePhone(phone);
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }
        const baseRate          = Number(rates);

        const service: CreateICUServiceDTO = {
          phoneNumber,
          baseRate
        }
        console.log(service);

        const dao = new ICUServiceDAO();

        // dao.create(facilityID, service)
        break;
      }
      case "Out Patient": {
        const OPserviceType     = OPType as ServiceType;
        const price             = Number(rates);

        try {
          const CTime             = validateTurnaroundCompletionTime(compTD, compTH)
          const completionTimeD   = CTime.days
          const completionTimeH   = CTime.hours
        } catch (error) {
console.log((error as Error).message)
          return fail(422, {
            error: (error as Error).message,
            description: "completion",
            success: false
          });
        }

        const acceptsWalkIns    = walkins === 'on';

        const service: CreateOutpatientServiceDTO = {
          serviceType: OPserviceType,
          price,
          completionTimeD,
          completionTimeH,
          acceptsWalkIns
        }
        console.log(service);

        const dao = new OutpatientServiceDAO();

        // dao.create(facilityID, service)
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
};