import { fail } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

import { DivisionDAO, ServicesDAO } from "$lib";

const divisionDAO = new DivisionDAO();
const servicesDAO = new ServicesDAO();

export const load: PageServerLoad = async ({ params }) => {
  const { divisionID } = params;

  if (!divisionID) {
    return fail(400, { error: "Division ID is required." });
  }

  try {
    const [divisionInfo, services] = await Promise.all([
      divisionDAO.getInformation(divisionID),

      servicesDAO.getByDivision(divisionID),
    ]);

    const response: Record<string, any> = {
      name        : divisionInfo.name,
      openingTime : divisionInfo.openingTime,
      closingTime : divisionInfo.closingTime,
      services,
    };

    if (divisionInfo.email) {
      response.email = divisionInfo.email[0];
    }

    if (divisionInfo.phoneNumber.length) {
      response.phoneNumber = divisionInfo.phoneNumber[0];
    }

    return response;
  } catch (error) {
    console.error(error);

    return fail(500, { description: "Could not get division information." });
  }
};
