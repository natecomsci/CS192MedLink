export async function load({ cookies }) {
  const facilityID = cookies.get('facilityID');
  return {
    facilityID: facilityID
  };
}
