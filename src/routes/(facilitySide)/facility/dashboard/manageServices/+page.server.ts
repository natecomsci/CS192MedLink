import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { FlatFacilityServicesDTO } from '$lib/server/DTOs';

export const load: PageServerLoad = async ({ cookies }) => {
  let services = cookies.get("services");

  if (!services) {
    return fail(422, {
      error: "Account has no services",
      description: "service"
    });
  }

  const servicesObj: FlatFacilityServicesDTO[] = JSON.parse(services);
  
  return {
    servicesObj
  };
};