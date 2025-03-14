import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import { ServicesDAO } from '$lib/server/ServicesDAO';
import type { ServiceDTO } from '$lib/server/DTOs';

export const load: PageServerLoad = async ({ cookies }) => {
  const servicesDAO = new ServicesDAO();
  const facilityID = cookies.get('facilityID');

  if (!facilityID) {
    return fail(422, {
      error: "Account not signed in.",
      description: "signIn"
    });
  }

  let services: ServiceDTO[] = await servicesDAO.getByFacility(facilityID);

  cookies.set('services', JSON.stringify(services), {path: '/'});

  services.sort((a, b) => {
    if (a.updatedAt < b.updatedAt) {
        return -1;
    }
    if (a.updatedAt > b.updatedAt) {
        return 1;
    }
    return 0;
  });
  
  return {
    services
  };
};