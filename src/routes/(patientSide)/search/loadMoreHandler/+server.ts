import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

import { patientSearchPageSize, PatientServiceListDAO } from '$lib';

const patientServiceListDAO = new PatientServiceListDAO()

export const POST: RequestHandler = async ({ request }) => {
  const { currOffset, query } : { currOffset: number, query: string } = await request.json();

  const { results, hasMore } = await patientServiceListDAO.patientSearch(query, {}, patientSearchPageSize, currOffset);

  console.log(results)
  return json({ results, hasMore })
};