import { fail, redirect } from '@sveltejs/kit';

import type { FacilityType, 
              Ownership, 
              Provider, 
              Session
            } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

import type { PageServerLoad, 
              Actions 
            } from './$types';

import { v4 as uuidv4 } from 'uuid';

import { type GeneralInformationFacilityDTO,
         FacilityDAO,
         validateEmail, 
         validatePhone, 
         validateStreet, 
         validateLink, 
         validateFacilityName, 
         validateImage,
         validateUser,
         provider,
         GeographyDAO,
         SessionDAO,  
      } from '$lib';

let sessionList: Session[]

let defPhoto: string
let defName: string
let defPhoneNumber: string[]
let defEmail: string[]
let defBookingSystem: string
let defFacilityType: FacilityType
let defOwnership: Ownership
let defAcceptedProviders: Provider[]

let defRegionID: Number
let defPOrCID: Number
let defCOrMID: Number
let defBrgyID: Number
let defStreet: string

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  const role = cookies.get('role');
  const hasAdmins = cookies.get('hasAdmins');
  const hasDivisions = cookies.get('hasDivisions');
  const token = cookies.get('auth-session');
  const employeeID = cookies.get('employeeID');

  if (!facilityID || !role || !hasAdmins || !hasDivisions || !token || !employeeID) {
    throw redirect(303, '/facility');
  }

  const sessionDAO = new SessionDAO();

  sessionList = await sessionDAO.getByEmployee(employeeID)

  const facilityDAO = new FacilityDAO();
  const geographyDAO = new GeographyDAO();

  try {
    let facilityInfo = await facilityDAO.getInformation(facilityID);

    defPhoto = facilityInfo.photo
    defName = facilityInfo.name
    defPhoneNumber = facilityInfo.phoneNumber
    defEmail = facilityInfo.email ?? []
    defBookingSystem = facilityInfo.bookingSystem ?? ""
    defFacilityType = facilityInfo.facilityType
    defOwnership = facilityInfo.ownership
    defAcceptedProviders = facilityInfo.acceptedProviders

    defRegionID = facilityInfo.address.regionID
    defPOrCID = facilityInfo.address.pOrCID
    defCOrMID = facilityInfo.address.cOrMID
    defBrgyID = facilityInfo.address.brgyID
    defStreet = facilityInfo.address.street

    return {
        regions: await geographyDAO.getRegions(),
        provinces: await geographyDAO.getProvinceOfRegion(facilityInfo.address.regionID),
        corms: await geographyDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
        brgys: await geographyDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

        facilityName: defName,

        photo: defPhoto,

        regionID: defRegionID,
        provinceID: defPOrCID, 
        cityID: defCOrMID, 
        barangayID: defBrgyID, 
        street: defStreet,

        email: defEmail,
        contactNumber: defPhoneNumber,
        type: defFacilityType,
        ownership: defOwnership,

        bookingSystem: defBookingSystem,
        
        providers: defAcceptedProviders,
    };
} catch (error) {
    return fail(500, {
        description: "Could not get facility information."
    });
}
};

export const actions = {
  update: async ({ cookies, request }) => {
    const facilityID = cookies.get('facilityID');
    const role = cookies.get('role');
    const hasAdmins = cookies.get('hasAdmins');
    const hasDivisions = cookies.get('hasDivisions');
    const token = cookies.get('auth-session');
    const employeeID = cookies.get('employeeID');

    if (!facilityID || !role || !hasAdmins || !hasDivisions || !token || !employeeID) {
      throw redirect(303, '/facility');
    }

    const validateSession = await validateUser(sessionList, token, employeeID)

    if (!validateSession) {
      return fail(422, { 
        error: "User is not authenticated",
        description: "authentication",
        success: false  
      });
    }

    const data = await request.formData();

    // Address handling
    const address = {
      regionID: Number(data.get('region')),
      pOrCID: Number(data.get('province')),
      cOrMID: Number(data.get('city')),
      brgyID: Number(data.get('brgy')),
      street: ''
    };

    // General Information
    let photo: string = defPhoto;
    let name: string, phoneNumber: string[], email: string[], bookingSystem: string;
    const facilityType: FacilityType = data.get('type') as FacilityType;
    const ownership: Ownership = data.get('ownership') as Ownership;
    const acceptedProviders: Provider[] = [];

    try {
      name = validateFacilityName(data.get('facilityName'));
      phoneNumber = [validatePhone(data.get('phoneNumber'), "Facility")];
      email = [await validateEmail(data.get('email'))];
      bookingSystem = String(data.get('bookingSystem')) === "" ? "" : await validateLink(data.get('bookingSystem'))
      address.street = validateStreet(data.get('street'));

    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "validation",
        success: false  
      });
    }

    for (const p of provider) {
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
        const { error: uploadError } = await supabase
          .storage
          .from('pictures')
          .upload(filePath, photoFile, { upsert: true });

        if (uploadError) {
          return fail(422, { 
            error: "Image upload failed: " + uploadError.message,
            description: "image",
            success: false  
          });
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

    if (defPhoto == photo && 
        defName == name &&
        defPhoneNumber.toString() == phoneNumber.toString() &&
        defEmail.toString() == email.toString() &&
        defBookingSystem == bookingSystem &&
        defFacilityType == facilityType &&
        defOwnership == ownership &&
        defRegionID == address.regionID &&
        defPOrCID == address.pOrCID &&
        defCOrMID == address.cOrMID &&
        defBrgyID == address.brgyID &&
        defStreet == address.street &&
        defAcceptedProviders.toString() == acceptedProviders.toString()
      ) {
      return fail(422, { 
        error: "No changes made",
        description: "button",
        success: false  
      });
    }

    await facilityDAO.update(facilityID, genInfo);

    return { success: true };
  }
} satisfies Actions;