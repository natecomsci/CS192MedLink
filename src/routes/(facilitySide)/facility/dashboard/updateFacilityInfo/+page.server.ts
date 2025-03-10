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
       } from '$lib/projectArrays';


let def_photo: string
let def_name: string
let def_phoneNumber: string
let def_email: string
let def_bookingSystem: string
let def_facilityType: FacilityType
let def_ownership: Ownership
let def_acceptedProviders: Provider[]

let def_regionID: Number
let def_pOrCID: Number
let def_cOrMID: Number
let def_brgyID: Number
let def_street: string


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

    def_photo = facilityInfo.photo
    def_name = facilityInfo.name
    def_phoneNumber = facilityInfo.phoneNumber
    def_email = facilityInfo.email
    def_bookingSystem = facilityInfo.bookingSystem ?? ""
    def_facilityType = facilityInfo.facilityType
    def_ownership = facilityInfo.ownership
    def_acceptedProviders = facilityInfo.acceptedProviders
    def_regionID = facilityInfo.address.regionID
    def_pOrCID = facilityInfo.address.pOrCID
    def_cOrMID = facilityInfo.address.cOrMID
    def_brgyID = facilityInfo.address.brgyID
    def_street = facilityInfo.address.street

    return {
        regions: await addressDAO.getRegions(),
        provinces: await addressDAO.getProvinceOfRegion(facilityInfo.address.regionID),
        corms: await addressDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
        brgys: await addressDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

        facilityName: def_name,

        photo: def_photo,

        regionID: def_regionID,
        provinceID: def_pOrCID, 
        cityID: def_cOrMID, 
        barangayID: def_brgyID, 
        street: def_street,

        email: def_email,
        contactNumber: def_phoneNumber,
        type: def_facilityType,
        ownership: def_ownership,

        bookingSystem: def_bookingSystem,
        
        providers: def_acceptedProviders,
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

    for (var p of providers) {
      if (data.get(p)) {
        acceptedProviders.push(p)
      }
    }

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

    if (def_photo         == photo &&
        def_name          == name &&
        def_phoneNumber   == phoneNumber &&
        def_email         == email &&
        def_bookingSystem == bookingSystem &&
        def_facilityType  == facilityType &&
        def_ownership     == ownership &&
        def_regionID      == address.regionID &&
        def_pOrCID        == address.pOrCID &&
        def_cOrMID        == address.cOrMID &&
        def_brgyID        == address.brgyID &&
        def_street        == address.street &&
        def_acceptedProviders.toString() == acceptedProviders.toString()) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    facilityDAO.updateGeneralInformation(facilityID, genInfo)

    return { success: true };
  }
} satisfies Actions;