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
import { v4 as uuidv4 } from 'uuid';
import { fail } from '@sveltejs/kit';

import { AddressDAO } from '$lib/server/AddressDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { createClient } from '@supabase/supabase-js';

import { validateEmail, 
         validatePhone, 
         validateStreet, 
         validateLink, 
         validateFacilityName, 
         validateImage
       } from '$lib/server/formValidators';

import { providers,  
       } from '$lib/projectArrays';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

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

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

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
    const facilityID = cookies.get('facilityID');

    if (!facilityID) {
      return fail(422, { 
        error: "Facility not signed in.",
        description: "facility",
        success: false  
      });
    }

    // Address handling
    const address = {
      regionID: Number(data.get('region')),
      pOrCID: Number(data.get('province')),
      cOrMID: Number(data.get('city')),
      brgyID: Number(data.get('brgy')),
      street: ''
    };

    try {
      address.street = validateStreet(data.get('street'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "street",
        success: false  
      });
    }

    // General Information
    let photo = def_photo;
    let name, phoneNumber, email, bookingSystem;
    const facilityType = data.get('type') as FacilityType;
    const ownership = data.get('ownership') as Ownership;
    const acceptedProviders: Provider[] = [];

    try {
      name = validateFacilityName(data.get('facilityName'));
      phoneNumber = validatePhone(data.get('phoneNumber'));
      email = await validateEmail(data.get('email'));
      bookingSystem = await validateLink(data.get('bookingSystem'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "validation",
        success: false  
      });
    }

    for (const p of providers) {
      if (data.get(p)) {
        acceptedProviders.push(p);
      }
    }

    // **Image Handling & Upload**
    const photoFile = data.get('facilityImage') as File;
    if (photoFile && photoFile.size > 0) {
      try {
        validateImage(photoFile);

        // Upload image to Supabase
        const filePath = `facilities/${facilityID}/${uuidv4()}`;
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('pictures')
          .upload(filePath, photoFile, { upsert: true });

        if (uploadError) {
          throw new Error("Image upload failed: " + uploadError.message);
        }

        // Get public URL for the uploaded image
        const { data: publicURLData } = supabase.storage.from('pictures').getPublicUrl(filePath);
        if (publicURLData.publicUrl) {
          photo = publicURLData.publicUrl;
        }

      } catch (error) {
        return fail(422, { 
          error: (error as Error).message,
          description: "image",
          success: false  
        });
      }
    }

    // Create General Information DTO
    const genInfo: GeneralInformationFacilityDTO = {
      name,
      photo,
      address,
      email,
      phoneNumber,
      facilityType,
      ownership,
      bookingSystem,
      acceptedProviders
    };

    const facilityDAO = new FacilityDAO();

    // Check if any changes were made
    if (def_photo == photo &&
        def_name == name &&
        def_phoneNumber == phoneNumber &&
        def_email == email &&
        def_bookingSystem == bookingSystem &&
        def_facilityType == facilityType &&
        def_ownership == ownership &&
        def_regionID == address.regionID &&
        def_pOrCID == address.pOrCID &&
        def_cOrMID == address.cOrMID &&
        def_brgyID == address.brgyID &&
        def_street == address.street &&
        def_acceptedProviders.toString() == acceptedProviders.toString()) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    // Update facility information
    await facilityDAO.updateGeneralInformation(facilityID, genInfo);

    return { success: true };
  }
} satisfies Actions;