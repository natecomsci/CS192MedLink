import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

import type { CreateAmbulanceServiceDTO, CreateBloodBankServiceDTO, CreateERServiceDTO, CreateICUServiceDTO, CreateOutpatientServiceDTO } from '$lib/server/dtos';
import { ServiceType } from '@prisma/client';
import { validateCoverageRadius, validateFloat, validateOpenClose, validatePhone, validateTurnaroundCompletionTime } from '$lib/server/formValidators';
import { AmbulanceServiceDAO, BloodBankServiceDAO, ERServiceDAO, ICUServiceDAO, OutpatientServiceDAO, type facilityServices } from '$lib/server/prisma';
import { FacilityDAO } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
  let serviceTypes: ServiceType[] = [
                        "CONSULTATION_GENERAL",
                        "BLOOD_CHEMISTRY_BUA",
                        "HEMATOLOGY_CBC",
                        "CLINICAL_FECALYSIS",  
                        "CLINICAL_URINALYSIS",
                        "X_RAY_CHEST_PA",
                        "X_RAY_C_SPINE",
                        "X_RAY_T_SPINE",
                        "X_RAY_L_SPINE",
                        "ULTRASOUND_ABDOMINAL",
                        "CT_SCAN_HEAD",
                        "CT_SCAN_C_SPINE",
                        "CT_SCAN_T_SPINE",
                        "CT_SCAN_L_SPINE",
                        "MRI_BRAIN",
                        "DENTAL_SCALING",
                        "THERAPY_PHYSICAL",
                        "ONCOLOGY_CHEMOTHERAPY",
                        "PROCEDURE_EEG",
                        "PROCEDURE_ECG",
                        "PROCEDURE_DIALYSIS",
                        "PROCEDURE_COLONOSCOPY",
                        "PROCEDURE_GASTROSCOPY",
                        "PROCEDURE_LABOR_DELIVERY",
                        "VACCINATION_COVID19"
                      ]

  const facilityDAO = new FacilityDAO();
  const facilityID = cookies.get('facilityID'); 

  if (!facilityID) {
    return fail(422, {
      description: "not signed in"
    });
  }

  const services: facilityServices = await facilityDAO.getServicesByFacility(facilityID);

  let availableServices = ["None"]
  let availableOPServices = ["None"]

  for (var [key, value] of Object.entries(services)) {
    if (value === null) {
      let name = "";
      if ("ambulanceService" == key) {
        name = "Ambulance";
      }
      if ("bloodBankService" == key) {
        name = "Blood Bank";
      }
      if ("erService" == key) {
        name = "Emergency Room";
      }
      if ("icuService" == key) {
        name = "ICU";
      }
      availableServices.push(name)
    }
  }

  let filteredOPService: ServiceType[] = []


  for (var service of services.outpatientServices) {
    filteredOPService.push(service.serviceType)
  }

  for (let serviceType of serviceTypes) { 
    if (!filteredOPService.includes(serviceType)) {
      availableOPServices.push(serviceType)
    }
  }

  if (availableOPServices.length !== 0) {
    availableServices.push("Outpatient")
  }
  // console.log(availableServices)
  // console.log(availableOPServices)
  return {
    availableServices,
    availableOPServices
  };
};


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

        try {
          validateCoverageRadius(minCover, maxCover)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "coverage",
            success: false
          });
        }

        try {
          validateFloat(rates, "Base Rate");
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        try {
          validateFloat(mileRate, "Mileage Rate");
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "mileRate",
            success: false
          });
        }


        const phoneNumber       = validatePhone(phone);
        
        const baseRate          = validateFloat(rates, "Base Rate");
        
        const mileageRate       = validateFloat(mileRate, "Mileage Rate");

        let { openingTime, closingTime }   = validateOpenClose(open, close)

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

        try {
          validateFloat(rates, "Price Per Unit");
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        const phoneNumber       = validatePhone(phone);
        const { openingTime, closingTime }   = validateOpenClose(open, close)
        const TTime              = validateTurnaroundCompletionTime(turnTD, turnTH)
        const turnaroundTimeD   = TTime.days;
        const turnaroundTimeH   = TTime.hours; 

        const pricePerUnit      = validateFloat(rates, "Price Per Unit");
        
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

        try {
          validateFloat(rates, "Base Rate");
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        const phoneNumber       = validatePhone(phone);
        const baseRate          = validateFloat(rates, "Base Rate");

        const service: CreateICUServiceDTO = {
          phoneNumber,
          baseRate
        }
        console.log(service);

        const dao = new ICUServiceDAO();

        dao.create(facilityID, service)
        break;
      }
      case "Outpatient": {
        try {
          validateFloat(rates, "Base Rate");
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "price",
            success: false
          });
        }

        try {
          validateTurnaroundCompletionTime(compTD, compTH)
        } catch (error) {

          return fail(422, {
            error: (error as Error).message,
            description: "completion",
            success: false
          });
        }

        const OPserviceType     = OPType as ServiceType;
        const price             = validateFloat(rates, "Base Rate");

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
} satisfies Actions;

