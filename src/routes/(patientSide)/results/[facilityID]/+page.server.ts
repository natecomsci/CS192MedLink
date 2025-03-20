import type { PageServerLoad } from "./$types";
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
    let facilityInfo = await facilityDAO.getGeneralInformation(facilityID);

    return {
      regions: await addressDAO.getRegions(),
      provinces: await addressDAO.getProvinceOfRegion(facilityInfo.address.regionID),
      corms: await addressDAO.getCOrMOfProvince(facilityInfo.address.pOrCID),
      brgys: await addressDAO.getBrgyOfCOrM(facilityInfo.address.cOrMID),

      facilityName: facilityInfo.name,
      photo: facilityInfo.photo,

      regionID: facilityInfo.address.regionID,
      provinceID: facilityInfo.address.pOrCID,
      cityID: facilityInfo.address.cOrMID,
      barangayID: facilityInfo.address.brgyID,
      street: facilityInfo.address.street,

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
