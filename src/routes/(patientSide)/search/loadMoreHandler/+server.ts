import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { patientSearchPageSize, PatientServiceListDAO } from '$lib';

const patientServiceListDAO = new PatientServiceListDAO()

export const POST: RequestHandler = async ({ request }) => {
  const { currOffset, query } : { currOffset: number, query: string } = await request.json();

  const { results, totalResults, totalFetched, hasMore } = await patientServiceListDAO.patientSearch(query, {}, patientSearchPageSize, currOffset); // needs filters
  return json({ results, totalResults, totalFetched, hasMore })
};