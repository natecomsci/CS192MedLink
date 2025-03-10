import { AddressDAO, FacilityDAO } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

import type { AddressDTO, M_UpdateGenInfoFacilityDTO } from '$lib/server/dtos';
import { validateEmail, validatePhone, validateStreet } from '$lib/server/formValidators';
import { fail } from '@sveltejs/kit';
import type { FacilityType, Ownership, Provider } from '@prisma/client';

export const load: PageServerLoad = async ({ cookies }) => {
  let address: AddressDAO = new AddressDAO();
  let providers: Provider[] = [
    "INTELLICARE",
    "ASIACARE",
    "AVEGA",
    "CAREWELL",
    "one_COOPHEALTH",
    "DYNAMIC_CARE_CORPORATION",
    "EASTWEST_HEALTHCARE",
    "FORTICARE",
    "GETWELL",
    "HC_and_D",
    "HEALTHFIRST",
    "HMI",
    "HPPI",
    "IWC",
    "ICARE",
    "KAISER",
    "LIFE_and_HEALTH",
    "MAXICARE",
    "MEDICARD",
    "MEDICARE",
    "MEDOCARE",
    "METROCARE",
    "OMHSI",
    "PACIFIC_CROSS",
    "PHILHEALTH",
    "VALUCARE",
    "WELLCARE",
  ];

  let types: FacilityType[] = [
    "BARANGAY_HEALTH_CENTER",
    "CLINIC",
    "HEALTH_CENTER",
    "HOSPITAL",
    "INFIRMARY",
    "POLYCLINIC",
    "PRIMARY_CARE_CLINIC",
    "CARDIOLOGY_CLINIC",
    "DENTAL_CLINIC",
    "DERMATOLOGY_CLINIC",
    "ENDOCRINOLOGY_CLINIC",
    "ENT_CLINIC",
    "FERTILITY_CLINIC",
    "GASTROENTEROLOGY_CLINIC",
    "IMMUNOLOGY_CENTER",
    "INFECTIOUS_DISEASE_CENTER",
    "MATERNITY_CENTER",
    "NEPHROLOGY_CLINIC",
    "NEUROLOGY_CLINIC",
    "ONCOLOGY_CENTER",
    "OPHTHALMOLOGY_CLINIC",
    "ORTHOPEDIC_CLINIC",
    "PEDIATRIC_CLINIC",
    "PULMONOLOGY_CLINIC",
    "RHEUMATOLOGY_CLINIC",
    "UROLOGY_CLINIC",
    "DIAGNOSTIC_LAB",
    "GENETIC_TESTING_LAB",
    "PATHOLOGY_LAB",
    "RADIOLOGY_CENTER",
    "BURN_CENTER",
    "CRITICAL_CARE_CENTER",
    "EMERGENCY_CENTER",
    "POISON_CONTROL_CENTER",
    "TRAUMA_CENTER",
    "URGENT_CARE_CENTER",
    "BLOOD_BANK",
    "DIALYSIS_CENTER",
    "MENTAL_HEALTH_FACILITY",
    "PAIN_MANAGEMENT_CLINIC",
    "REHABILITATION_CENTER",
    "SLEEP_CENTER",
    "SUBSTANCE_ABUSE_CENTER",
    "TRANSPLANT_CENTER",
    "ALTERNATIVE_MEDICINE_CENTER",
    "HERBAL_MEDICINE_CENTER",
    "PHYSICAL_THERAPY_CENTER",
    "AMBULATORY_CARE_CENTER",
    "SURGICAL_CENTER",
    "AMBULANCE_SERVICE",
  ];

  let facilityDAO = new FacilityDAO();
  let facilityID = cookies.get('facilityID');

  if (!facilityID) {
    return fail(422, {
      description: "not signed in"
    });
  }

  try {
    let facilityInfo = await facilityDAO.getGeneralInformation(facilityID);

    return {
      regions: await address.getRegions(),
      providers,
      types,
      facilityName: facilityInfo.name,
      email: facilityInfo.email,
      region: facilityInfo.address.regionID,
      province: facilityInfo.address.pOrCID,
      city: facilityInfo.address.cOrMID,
      brgy: facilityInfo.address.brgyID,
      street: facilityInfo.address.street, 
      contactNumber: facilityInfo.phoneNumber, // Assuming phoneNumber is the contact number
      type: facilityInfo.facilityType,
      ownership: facilityInfo.ownership,
      bookingSystem: facilityInfo.bookingSystem || "", // Fallback to empty string if null
  };
  } catch (error) {
    console.error("Details: ", error);
    return fail(500, {
      description: "Could not get facility information."
    });
  }
};

export const actions = {
  update: async ({ cookies, request }) => {
    const data = await request.formData();
    const facilityID = cookies.get('facilityID')

    if (!facilityID) {
      return fail(422, { 
        error: "Facility not signed in.",
        description: "facility",
        success: false  
      });
    }

    // address
    const regionID      = Number(data.get('region'));
    const pOrCID        = Number(data.get('province'));
    const cOrMID        = Number(data.get('city'));
    const brgyID        = Number(data.get('brgy'));
    let street        = data.get('street');

    try {
      validateStreet(data.get('street'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "street",
        success: false  
      });
    }
    street = validateStreet(data.get('street'));
    
    const address: AddressDTO = {
      regionID,
      pOrCID,
      cOrMID,
      brgyID,
      street
    }

    // genInfo part
    const name  = data.get('facilityName') as string;
    const photo = data.get('facilityImage') as string;

    try {
      await validateEmail(data.get('email'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "email",
        success: false  
      });
    }

    const email = await validateEmail(data.get('email'));

    try {
      validatePhone(data.get('phoneNumber'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "phoneNumber",
        success: false  
      });
    }

    const phoneNumber = validatePhone(data.get('phoneNumber'));
    const facilityType = data.get('type') as FacilityType
    const ownership = data.get('ownership') as Ownership
    const bookingSystem = data.get('bookingSystem') as string
    const acceptedProviders: Provider[] = []

    const genInfo: M_UpdateGenInfoFacilityDTO = {
      name               ,
      photo              ,
      address            ,
      email              ,
      phoneNumber        ,
      facilityType       ,
      ownership          ,
      bookingSystem      ,
      acceptedProviders
    }

    console.log(genInfo)

    const facilityDAO = new FacilityDAO();

    facilityDAO.updateGeneralInformation(facilityID, genInfo)

    return { success: true };
  }
} satisfies Actions;