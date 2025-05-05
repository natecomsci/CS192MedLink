import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

import { FacilityDAO, GeographyDAO, ContactDAO } from '$lib';

export const load: PageServerLoad = async ({ params }) => {
  const facilityDAO = new FacilityDAO();
  const geographyDAO = new GeographyDAO();
  const contactDAO = new ContactDAO();
  const { facilityID } = params;

  if (!facilityID) {
    throw redirect(303, "/facility"); // Redirect if no facility ID is found
  }

  try {
    const hasDivisions = await facilityDAO.facilityHasDivisions(facilityID);
    const facilityInfo = await facilityDAO.getInformation(facilityID);

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

    const phoneNumbers = await contactDAO.getPhoneNumbersByFacility(facilityID);
    const contactNumber = phoneNumbers.length > 0 ? phoneNumbers[0] : "N/A";

    const emails = await contactDAO.getEmailsByFacility(facilityID);
    const email = emails.length > 0 ? emails[0] : "N/A";

    return {
      regions: await geographyDAO.getRegions(),
      provinces: await geographyDAO.getProvinceOfRegion(facilityInfo.address.regionID),
      corms: await geographyDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
      brgys: await geographyDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

      facilityName: facilityInfo.name,
      photo: facilityInfo.photo,

      fullAddress,

      contactNumber,
      email,
      type: facilityInfo.facilityType,
      ownership: facilityInfo.ownership,

      bookingSystem: facilityInfo.bookingSystem ?? "",
      providers: facilityInfo.acceptedProviders,
      hasDivisions
    };
  } catch (error) {
    console.error(error);
    return fail(500, {
      description: "Could not get facility information.",
    });
  }
};

export const actions = {
  viewServices: async ({ params }) => {
    const { facilityID } = params;
    throw redirect(303, "/facilityInfo/" + facilityID + "/services");
  },

  viewDivision: async ({ params }) => {
    const { facilityID } = params;
    throw redirect(303, "/facilityInfo/" + facilityID + "/divisions");
  },
} satisfies Actions;
