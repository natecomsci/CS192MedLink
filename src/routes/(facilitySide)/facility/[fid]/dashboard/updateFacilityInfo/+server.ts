import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { getProvinces, getCities } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
  // location is of type RegionDTO | POrCDTO | COrMDTO | BrgyDTO
  const { location } = await request.json();
  console.log(location)
  if (location.regionID) {
    const rv = await getProvinces(location.regionID);
    console.log(rv)
    return rv;
  }
  else if (location.pOrCID) {
    const rv = await getCities(location.pOrCID);
    return rv;
  }
  else if (location.cOrMID) {
    const rv = await getCities(location.cOrMID);
    return rv;
  }
  return json("error")
};