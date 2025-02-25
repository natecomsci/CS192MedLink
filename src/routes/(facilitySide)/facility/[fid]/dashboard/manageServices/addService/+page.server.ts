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
          validatePhone(phone);
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          validateOpenClose(open, close)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "openClose",
            success: false
          });
        }

        const phoneNumber       = validatePhone(phone);
        
        const baseRate          = Number(rates);
        
        const mileageRate       = Number(mileRate);
        let { openingTime, closingTime }   = validateOpenClose(open, close)

        openingTime = (new Date(openingTime)).toISOString()
        closingTime = (new Date(closingTime)).toISOString()
        console.log(openingTime, closingTime)
        
        try {
          validateCoverageRadius(minCover, maxCover)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "coverage",
            success: false
          });
        }
        const { minCoverageRadius, maxCoverageRadius } = validateCoverageRadius(minCover, maxCover)
        
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

        dao.create(facilityID, service)
        break;
      }
      case "Blood Bank": {
        try {
          validatePhone(phone);
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }

        try {
          validateOpenClose(open, close)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "openClose",
            success: false
          });
        }

        try {
          validateTurnaroundCompletionTime(turnTD, turnTH)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "turnaround",
            success: false
          });
        }

        const phoneNumber       = validatePhone(phone);
        const { openingTime, closingTime }   = validateOpenClose(open, close)
        const TTime              = validateTurnaroundCompletionTime(turnTD, turnTH)
        const turnaroundTimeD   = TTime.days;
        const turnaroundTimeH   = TTime.hours; 

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

        dao.create(facilityID, service)
        break;
      }
      case "Emergency Room": {
        try {
          validatePhone(phone);
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }
        const phoneNumber       = validatePhone(phone);

        const service: CreateERServiceDTO = {
          phoneNumber
        }
        console.log(service);

        const dao = new ERServiceDAO();

        dao.create(facilityID, service)
        break;
      }
      case "ICU": {
        try {
          validatePhone(phone);
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "phoneNumber",
            success: false
          });
        }
        const phoneNumber       = validatePhone(phone);
        const baseRate          = Number(rates);

        const service: CreateICUServiceDTO = {
          phoneNumber,
          baseRate
        }
        console.log(service);

        const dao = new ICUServiceDAO();

        dao.create(facilityID, service)
        break;
      }
      case "Out Patient": {
        const OPserviceType     = OPType as ServiceType;
        const price             = Number(rates);

        try {
          validateTurnaroundCompletionTime(compTD, compTH)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "completion",
            success: false
          });
        }

        const CTime             = validateTurnaroundCompletionTime(compTD, compTH)
        const completionTimeD   = CTime.days
        const completionTimeH   = CTime.hours

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
};