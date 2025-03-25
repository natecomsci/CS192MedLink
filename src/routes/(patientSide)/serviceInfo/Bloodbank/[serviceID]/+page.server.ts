import { BloodBankServiceDAO } from '$lib/server/BloodBankDAO';
import type { PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params }) => {
  if (!params.serviceID) {
    throw redirect(303, "/facility");
  }

  const bloodBankServicesDAO = new BloodBankServiceDAO();

  try {
    const service = await bloodBankServicesDAO.getInformation(params.serviceID);
    if (!service) {
      throw new Error("Service not found.");
    }

    return {
      phoneNumber: service.phoneNumber,
      openingTime: service.openingTime,
      closingTime: service.closingTime,
      pricePerUnit: service.pricePerUnit,
      turnaroundTimeD: service.turnaroundTimeD,
      turnaroundTimeH: service.turnaroundTimeH,
      bloodTypeAvailability: service.bloodTypeAvailability,
      updatedAt: service.updatedAt,
    };
  } catch (error) {
    console.error("Error loading service details:", error);
    return fail(500, { description: "Could not get service information." });
  }
};
