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
       } from '$lib/projectTypes';

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

    // Fetch names for region, province, city, and barangay using their IDs
    const regionName = await addressDAO.getRegions().then(regions => 
        regions.find(r => r.regionID === facilityInfo.address.regionID)?.name
    );
    const provinceName = await addressDAO.getProvinceOfRegion(facilityInfo.address.regionID).then(provinces => 
        provinces.find(p => p.pOrCID === facilityInfo.address.pOrCID)?.name
    );
    const cityName = await addressDAO.getCOrMOfProvince(facilityInfo.address.pOrCID).then(cities => 
        cities.find(c => c.cOrMID === facilityInfo.address.cOrMID)?.name
    );
    const barangayName = await addressDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID).then(barangays => 
        barangays.find(b => b.brgyID === facilityInfo.address.brgyID)?.name 
    );

    return {
        regions: await addressDAO.getRegions(),

        facilityName: facilityInfo.name,
        providers,
        OPServiceTypes,

        email: facilityInfo.email,
        contactNumber: facilityInfo.phoneNumber,
        type: facilityInfo.facilityType,
        ownership: facilityInfo.ownership,
        bookingSystem: facilityInfo.bookingSystem || "",

        region: {regionName, regionID: facilityInfo.address.regionID},
        province: {provinceName, provinceID: facilityInfo.address.pOrCID}, 
        city: {cityName, cityID: facilityInfo.address.cOrMID}, 
        barangay: {barangayName, barangayID: facilityInfo.address.brgyID}, 
        street: facilityInfo.address.street,
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
      street = validateStreet(data.get('street'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "street",
        success: false  
      });
    }
    // street = validateStreet(data.get('street'));
    
    const address: AddressDTO = {
      regionID,
      pOrCID,
      cOrMID,
      brgyID,
      street
    }

    // genInfo part
    const photo = data.get('facilityImage') as string;

    try {
      await validateFacilityName(data.get('facilityName'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "name",
        success: false  
      });
    }

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
    try {
      validateLink(data.get('bookingSystem'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "bookingSystem",
        success: false  
      });
    }

    const name  = data.get('facilityName') as string;
    const phoneNumber = validatePhone(data.get('phoneNumber'));
    const facilityType = data.get('type') as FacilityType
    const ownership = data.get('ownership') as Ownership
    const bookingSystem = data.get('bookingSystem') as string
    const acceptedProviders: Provider[] = []

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

    console.log(genInfo)

    const facilityDAO = new FacilityDAO();

    facilityDAO.updateGeneralInformation(facilityID, genInfo)

    return { success: true };
  }
} satisfies Actions;