import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { dateToTimeMapping, DivisionDAO, ServicesDAO, type ServiceDTO } from "$lib";
const divisionDAO = new DivisionDAO();
const servicesDAO = new ServicesDAO();

export const load: PageServerLoad = async ({ params }) => {

  const { divisionID } = params;

  if (!divisionID) {
    return fail(400, { description: "Missing division ID." });
  }

  try {
    const division = await divisionDAO.getInformation(divisionID);

    if (!division) {
      return fail(404, { description: "Division not found." });
    }

    // Check if division has services using DAO method
    const hasServices = await divisionDAO.divisionHasServices(divisionID);
    
    let services: ServiceDTO[] = [];
    if (hasServices) {
      services = await servicesDAO.getByDivision(divisionID);
    }
    

    return {
      divisionName: division.name ?? "Unknown Division",
      phoneNumber: division.phoneNumber ?? "Unknown",
      email: division.email ?? "Unknown",
      openTime: dateToTimeMapping(division.openingTime) as string,
      closeTime: dateToTimeMapping(division.closingTime) as string,
      hasServices,
      services: services ?? [],
    };

  } catch (error) {
    console.error("Division load error:", error);
    return fail(500, { description: "Could not fetch division information." });
  }
};
