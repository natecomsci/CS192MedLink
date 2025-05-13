import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { patientSearchPageSize, PatientServiceListDAO } from '$lib';

const patientServiceListDAO = new PatientServiceListDAO()

export const POST: RequestHandler = async ({ request }) => {
  const { currOffset, query, facilityID } : { currOffset: number, query: string, facilityID: string } = await request.json();

  const sortOption = { updatedAt: "desc" };

  let result;

  if (query) {
    result = await patientServiceListDAO.patientSearchServicesByFacility(
      facilityID,
      query,
      patientSearchPageSize,
      currOffset,
      sortOption,
    );
  } else {
    result = await patientServiceListDAO.getLoadMoreServicesByFacility(
      facilityID,
      patientSearchPageSize,
      currOffset,
      sortOption,
    );
  }

  return json(result);
};

