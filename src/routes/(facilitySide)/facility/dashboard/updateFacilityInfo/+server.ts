import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { AddressDAO } from '$lib/server/AddressDAO';

let address: AddressDAO = new AddressDAO();

export const POST: RequestHandler = async ({ request }) => {
  // location is of type RegionDTO | POrCDTO | COrMDTO
  const location = await request.json();

  if (location.regionID) {
    const rv = await address.getProvinceOfRegion(location.regionID);
    return json(rv);
  }
  else if (location.pOrCID) {
    const rv = await address.getCOrMOfProvince(location.pOrCID);
    return json(rv);
  }
  else if (location.cOrMID) {
    const rv = await address.getBrgyOfCOrM(location.cOrMID);
    return json(rv);
  }
  return json("error")
};