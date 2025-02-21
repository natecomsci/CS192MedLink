import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { AddressDAO } from '$lib/server/prisma';

let address: AddressDAO = new AddressDAO();

export const POST: RequestHandler = async ({ request }) => {
  // location is of type RegionDTO | POrCDTO | COrMDTO | BrgyDTO
  const location = await request.json();
  console.log(location)
  if (location.regionID) {
    const rv = await address.getPOrCOfRegion(location.regionID);
    console.log(rv)
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