import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    facilityID: cookies.get('facilityID'),
  };
};