import { fail, redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

import { FacilityDAO, GeographyDAO } from "$lib";

const facilityDAO = new FacilityDAO();

const geographyDAO = new GeographyDAO();

export const load: PageServerLoad = async ({ params }) => {
  const { facilityID } = params;

  if (!facilityID) {
    return fail(400, { error: "Facility ID is required." });
  }

  try {
    const [facilityInfo, hasDivisions] = await Promise.all([
      facilityDAO.getInformation(facilityID),

      facilityDAO.facilityHasDivisions(facilityID),
    ]);

    const address = facilityInfo.address
      ? await (async () => {
          const [region, province, city, barangay] = await Promise.all([
            geographyDAO.getNameOfRegion(facilityInfo.address.regionID),
            geographyDAO.getNameOfProvince(facilityInfo.address.pOrCID),
            geographyDAO.getNameOfCOrM(facilityInfo.address.cOrMID),
            geographyDAO.getNameOfBrgy(facilityInfo.address.brgyID),
          ]);

          return {
            street: facilityInfo.address.street,
            region,
            province,
            city,
            barangay,
          };
        })()
      : null;

    const response: Record<string, any> = {
      name              : facilityInfo.name,
      photo             : facilityInfo.photo,
      address,
      facilityType      : facilityInfo.facilityType,
      ownership         : facilityInfo.ownership,
      acceptedProviders : facilityInfo.acceptedProviders,
      hasDivisions,
    };

    if (facilityInfo.email) {
      response.email = facilityInfo.email[0];
    }

    if (facilityInfo.phoneNumber.length) {
      response.phoneNumber = facilityInfo.phoneNumber[0];
    }

    if (facilityInfo.bookingSystem) {
      response.bookingSystem = facilityInfo.bookingSystem;
    }

    if (!hasDivisions) {
      response.openingTime = facilityInfo.openingTime;
      response.closingTime = facilityInfo.closingTime;
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get facility information." });
  }
};

export const actions = {
  viewServices: async ({ params }) => {
    const { facilityID } = params;

    throw redirect(303, `/facilityInfo/${facilityID}/services`);
  },

  viewDivision: async ({ params }) => {
    const { facilityID } = params;

    throw redirect(303, `/facilityInfo/${facilityID}/divisions`);
  },
} satisfies Actions;
