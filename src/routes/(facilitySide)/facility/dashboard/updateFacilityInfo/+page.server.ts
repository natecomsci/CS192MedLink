import type { FacilityType, 
              Ownership, 
              Provider 
            } from '@prisma/client';
import type { PageServerLoad, 
              Actions 
            } from './$types';
import type { AddressDTO, 
              GeneralInformationFacilityDTO 
            } from '$lib/server/DTOs';

import { fail } from '@sveltejs/kit';

import { AddressDAO } from '$lib/server/AddressDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';

import { validateEmail, 
         validatePhone, 
         validateStreet, 
         validateLink, 
         validateFacilityName 
       } from '$lib/server/formValidators';

import { providers, 
         OPServiceTypes 
       } from '$lib/projectArrays';

export const load: PageServerLoad = async ({ cookies }) => {
  let facilityDAO = new FacilityDAO();
  let facilityID = cookies.get('facilityID');
  
  if (!facilityID) {
    return fail(422, {
      error: "Facility is not signed in.",
      description: "not signed in"
    });
  }

  const addressDAO = new AddressDAO();

  try {
    let facilityInfo = await facilityDAO.getGeneralInformation(facilityID);

    return {
        regions: await addressDAO.getRegions(),
        provinces: await addressDAO.getProvinceOfRegion(facilityInfo.address.regionID),
        corms: await addressDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
        brgys: await addressDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

        facilityName: facilityInfo.name,
        providers: facilityInfo.acceptedProviders,

        email: facilityInfo.email,
        contactNumber: facilityInfo.phoneNumber,
        type: facilityInfo.facilityType,
        ownership: facilityInfo.ownership,
        bookingSystem: facilityInfo.bookingSystem ?? "",
        
        regionID: facilityInfo.address.regionID,
        provinceID: facilityInfo.address.pOrCID, 
        cityID: facilityInfo.address.cOrMID, 
        barangayID: facilityInfo.address.brgyID, 

        street: facilityInfo.address.street,
    };
} catch (error) {
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
    let street          = data.get('street');

    try {
      street = validateStreet(data.get('street'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "street",
        success: false  
      });
    }
    
    const address: AddressDTO = {
      regionID,
      pOrCID,
      cOrMID,
      brgyID,
      street
    }

    // genInfo part
    const photo = data.get('facilityImage') as string;
    let name: string
    let phoneNumber: string
    let email: string
    let bookingSystem: string
    const facilityType = data.get('type') as FacilityType
    const ownership = data.get('ownership') as Ownership
    const acceptedProviders: Provider[] = []

    try {
      name = validateFacilityName(data.get('facilityName'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "name",
        success: false  
      });
    }

    try {
      phoneNumber = validatePhone(data.get('phoneNumber'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "phoneNumber",
        success: false  
      });
    }

    try {
      email = await validateEmail(data.get('email'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "email",
        success: false  
      });
    }

    try {
      bookingSystem = await validateLink(data.get('bookingSystem'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "bookingSystem",
        success: false  
      });
    }

    let provider

    for (var p of providers) {
      provider = data.get(p)

      if (provider) {
        acceptedProviders.push(p)
      }
    }

    console.log(acceptedProviders)


    const genInfo: GeneralInformationFacilityDTO = {
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

    const facilityDAO = new FacilityDAO();

    facilityDAO.updateGeneralInformation(facilityID, genInfo)

    return { success: true };
  }
} satisfies Actions;