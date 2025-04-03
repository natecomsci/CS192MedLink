import { json, type RequestHandler } from '@sveltejs/kit';
import { GeographyDAO } from '$lib';

let geographyDAO = new GeographyDAO();

export const POST: RequestHandler = async ({ request }) => {
  // location is of type RegionDTO | POrCDTO | COrMDTO
  const location = await request.json();

  if (location.regionID) {
    const rv = await geographyDAO.getProvinceOfRegion(location.regionID);
    return json(rv);
  }
  else if (location.pOrCID) {
    const rv = await geographyDAO.getCOrMOfProvince(location.pOrCID);
    return json(rv);
  }
  else if (location.cOrMID) {
    const rv = await geographyDAO.getBrgyOfCOrM(location.cOrMID);
    return json(rv);
  }
  return json("error")
};