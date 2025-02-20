import type { PageServerLoad } from './$types';

import { getRegions } from '$lib/server/prisma';

// import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO} from '$lib/server/interfaces.ts';

export const load: PageServerLoad = async () => {
  return {
    regions: await getRegions()
  };
};


