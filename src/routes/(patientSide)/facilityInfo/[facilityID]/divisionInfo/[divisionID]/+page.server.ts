import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import { dateToTimeMapping, DivisionDAO, ServicesDAO, ContactDAO, type ServiceDTO } from "$lib";
const divisionDAO = new DivisionDAO();
const servicesDAO = new ServicesDAO();
const contactDAO = new ContactDAO();

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

    // Fetch phone numbers and emails for the division using the ContactDAO
    const phoneNumbers = await contactDAO.getPhoneNumbersByDivision(divisionID);
    const contactNumber = phoneNumbers.length > 0 ? phoneNumbers[0] : "Unknown";

    const emails = await contactDAO.getEmailsByDivision(divisionID);
    const email = emails.length > 0 ? emails[0] : "Unknown";

    // Check if division has services using DAO method
    const hasServices = await divisionDAO.divisionHasServices(divisionID);
    
    let services: ServiceDTO[] = [];
    if (hasServices) {
      services = await servicesDAO.getByDivision(divisionID);
    }
    
    return {
      divisionName: division.name ?? "Unknown Division",
      phoneNumber: contactNumber,
      email: email,
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
