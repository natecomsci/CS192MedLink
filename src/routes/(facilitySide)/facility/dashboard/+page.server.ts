import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const facilityID = cookies.get('facilityID');
  return {
    facilityID: facilityID,
  };
};