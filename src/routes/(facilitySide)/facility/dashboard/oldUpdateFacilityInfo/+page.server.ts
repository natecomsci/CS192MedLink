import { AddressDAO } from '$lib/server/daos';
import type { PageServerLoad, Actions } from './$types';

import type { AddressDTO } from '$lib/server/dtos';
import { validateStreet } from '$lib/server/formValidators';
import { fail } from '@sveltejs/kit';

let address: AddressDAO = new AddressDAO();

export const load: PageServerLoad = async () => {
  return {
    regions: await address.getRegions()
  };
};


export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const facilityID = cookies.get('facilityID')

    console.log("addressDTO")
    if (!facilityID) {
      return fail(422, { 
        error: "Facility not signed in.",
        description: "facility",
        success: false  
      });
    }

    console.log("addressDTO")
    const facilityImage = data.get('facilityImage') as string
    const regionID      = Number(data.get('region'));
    const pOrCID        = Number(data.get('province'));
    const cOrMID        = Number(data.get('city'));
    const brgyID        = Number(data.get('brgy'));

    try {
      const street        = validateStreet(data.get('street'));
    } catch (error) {
      return fail(422, { 
        error: (error as Error).message,
        description: "street",
        success: false  
      });
    }
    
    const addressDTO: AddressDTO = {
      regionID,
      pOrCID,
      cOrMID,
      brgyID,
      street
    }


    address.updateAddress(facilityID, addressDTO)

    // send data to db

    // console.log(await prisma.ambulanceService.findUnique( {where: { facilityID: "0eea8939-c386-46ad-95a2-12ae60740758" }} ));

    return { success: true };
  }
} satisfies Actions;