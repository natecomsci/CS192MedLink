// import type { PageServerLoad } from './$types';

import { AddressDAO } from '$lib/server/prisma';
// import { fail } from '@sveltejs/kit';

import type { PageServerLoad, Actions } from './$types';

// import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO} from '$lib/server/interfaces.ts';

let address: AddressDAO = new AddressDAO();

export const load: PageServerLoad = async () => {
  return {
    regions: await address.getRegions()
  };
};
