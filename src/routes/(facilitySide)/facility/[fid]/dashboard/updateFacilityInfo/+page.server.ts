// import type { PageServerLoad } from './$types';

import { getRegions } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

import type { PageServerLoad, Actions } from './$types';

import type { AmbulanceData, BloodData, ERData, ICUData, OPData } from '$lib/server/interfaces';

// import type { RegionDTO, POrCDTO, COrMDTO, BrgyDTO, AddressDTO} from '$lib/server/interfaces.ts';

export const load: PageServerLoad = async () => {
  return {
    regions: await getRegions()
  };
};


export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const region = data.get('region');
    const province = data.get('province');
    const city = data.get('city');
    const brgy = data.get('brgy');
    console.log(region)

    if (region != "Region") {
      if (province != "Province") {
        if (city != "City") {
          if (brgy != "Barangay") {
            
          }
        }
        else {

        }
      }
      else {

      }
    } 
    
    return { success: true };
  }
} satisfies Actions;