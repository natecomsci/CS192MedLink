import type { Actions, PageServerLoad } from "./$types";
import { AddressDAO } from '$lib/server/AddressDAO';
import { FacilityDAO } from '$lib/server/FacilityDAO';
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  const facilityDAO = new FacilityDAO();
  const addressDAO = new AddressDAO();
  const { facilityID } = params;

  if (!facilityID) {
    throw redirect(303, "/facility"); // Redirect if no facility ID is found
  }

  try {
    console.log("Fetching facility and address details...");
    let facilityInfo = await facilityDAO.getGeneralInformation(facilityID);
    let fullAddress = null;

    if (facilityInfo.address) {
      const [region, province, city, barangay] = await Promise.all([
        addressDAO.getNameOfRegion(facilityInfo.address.regionID),
        addressDAO.getNameOfProvince(facilityInfo.address.pOrCID),
        addressDAO.getNameOfCOrM(facilityInfo.address.cOrMID),
        addressDAO.getNameOfBrgy(facilityInfo.address.brgyID),
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
      regions: await addressDAO.getRegions(),
      provinces: await addressDAO.getProvinceOfRegion(facilityInfo.address.regionID),
      corms: await addressDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
      brgys: await addressDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

      facilityName: facilityInfo.name,
      photo: facilityInfo.photo,
      
      fullAddress: fullAddress, // Replaces regionID, provinceID, cityID, barangayID, and street

      email: facilityInfo.email,
      contactNumber: facilityInfo.phoneNumber,
      type: facilityInfo.facilityType,
      ownership: facilityInfo.ownership,

      bookingSystem: facilityInfo.bookingSystem ?? "",
      providers: facilityInfo.acceptedProviders,
    };
  } catch (error) {
    console.error("Error loading facility details:", error);
    return fail(500, {
      description: "Could not get facility information.",
    });
  }
};

export const actions = {
  viewServices: async ({ params }) => {
    const { facilityID } = params;

    // Redirect to the facility details page
    throw redirect(303, `/servicesForSearch/${facilityID}`);
  },
} satisfies Actions;
