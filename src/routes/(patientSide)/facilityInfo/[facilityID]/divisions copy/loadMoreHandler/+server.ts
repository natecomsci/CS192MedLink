import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { patientSearchPageSize, PatientDivisionListDAO } from '$lib';

const patientDivisionListDAO = new PatientDivisionListDAO()

export const POST: RequestHandler = async ({ request }) => {
  const { currOffset, query, facilityID } : { currOffset: number, query: string, facilityID: string } = await request.json();

  const sortOption = { updatedAt: "desc" };

  let result;

  if (query) {
    result = await patientDivisionListDAO.patientSearchDivisionsByFacility(
      facilityID,
      query,
      patientSearchPageSize,
      currOffset,
      sortOption,
    );
  } else {
    result = await patientDivisionListDAO.getLoadMoreDivisionsByFacility(
      facilityID,
      patientSearchPageSize,
      currOffset,
      sortOption,
    );
  }

  return json(result);
};

