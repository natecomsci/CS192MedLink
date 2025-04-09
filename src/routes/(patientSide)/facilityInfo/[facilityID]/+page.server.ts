import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { FacilityDAO, GeographyDAO } from '$lib';

export const load: PageServerLoad = async ({ params }) => {
  const facilityDAO = new FacilityDAO();
  const geographyDAO = new GeographyDAO();
  const { facilityID } = params;
  const hasDivisions = await facilityDAO.facilityHasDivisions(facilityID);

  if (!facilityID) {
    throw redirect(303, "/facility"); // Redirect if no facility ID is found
  }

  try {
    let facilityInfo = await facilityDAO.getInformation(facilityID);
    let fullAddress = null;

    if (facilityInfo.address) {
      const [region, province, city, barangay] = await Promise.all([
        geographyDAO.getNameOfRegion(facilityInfo.address.regionID),
        geographyDAO.getNameOfProvince(facilityInfo.address.pOrCID),
        geographyDAO.getNameOfCOrM(facilityInfo.address.cOrMID),
        geographyDAO.getNameOfBrgy(facilityInfo.address.brgyID),
      ]);

      fullAddress = {
        street: facilityInfo.address.street,
        region: region || "Unknown Region",
        province: province || "Unknown Province",
        city: city || "Unknown City",
        barangay: barangay || "Unknown Barangay",
      };
    }

    return {
      regions: await geographyDAO.getRegions(),
      provinces: await geographyDAO.getProvinceOfRegion(facilityInfo.address.regionID),
      corms: await geographyDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
      brgys: await geographyDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

      facilityName: facilityInfo.name,
      photo: facilityInfo.photo,
      
      fullAddress: fullAddress, // Replaces regionID, provinceID, cityID, barangayID, and street

      email: facilityInfo.email,
      contactNumber: facilityInfo.phoneNumber,
      type: facilityInfo.facilityType,
      ownership: facilityInfo.ownership,

      bookingSystem: facilityInfo.bookingSystem ?? "",
      providers: facilityInfo.acceptedProviders,
      hasDivisions
    };
  } catch (error) {
    return fail(500, {
      description: "Could not get facility information.",
    });
  }
};

export const actions = {
  viewServices: async ({ params }) => {
    const { facilityID } = params;
    // Redirect to the facility details page
    throw redirect(303, "/facilityInfo/"+facilityID+"/services");
  },

  viewDivision: async ({ params }) => {
    const { facilityID } = params;
    // Redirect to the facility details page
    throw redirect(303, "/facilityInfo/"+facilityID+"/divisions");
  },
} satisfies Actions;
