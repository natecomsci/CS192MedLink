import { AddressDAO } from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

import type { AddressDTO } from '$lib/server/dtos';

let address: AddressDAO = new AddressDAO();

export const load: PageServerLoad = async () => {
  return {
    regions: await address.getRegions()
  };
};


export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();

    const facilityImage = data.get('facilityImage') as string
    const regionID      = Number(data.get('region'));
    const pOrCID        = Number(data.get('province'));
    const cOrMID        = Number(data.get('city'));
    const brgyID        = Number(data.get('brgy'));
    const street        = data.get('street') as string;

    const address: AddressDTO = {
      regionID,
      pOrCID,
      cOrMID,
      brgyID,
      street
    }

    // send data to db

    // console.log(await prisma.ambulanceService.findUnique( {where: { facilityID: "0eea8939-c386-46ad-95a2-12ae60740758" }} ));

    return { success: true };
  }
} satisfies Actions;