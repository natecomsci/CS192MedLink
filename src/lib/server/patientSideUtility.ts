import { GeographyDAO, ContactDAO, OperatingHoursDAO } from "$lib";

const geographyDAO = new GeographyDAO();

const contactDAO = new ContactDAO();

const operatingHoursDAO = new OperatingHoursDAO();

export async function getFromSearchInformation({
  serviceInfo,
  facilityInfo,
  hasDivisions,
}: {
  serviceInfo: {
    phoneNumber?   : string[];
    openingTime?   : Date;
    closingTime?   : Date;
    division?      : { 
        divisionID : string; 
        name?      : string; 
    }
    note?          : string;
  };
  facilityInfo: {
    name           : string;
    phoneNumber?   : string[];
    openingTime?   : Date;
    closingTime?   : Date;
    address?: {
      street       : string;
      regionID     : number;
      pOrCID       : number;
      cOrMID       : number;
      brgyID       : number;
    };
  };
  hasDivisions: boolean;
}): Promise<{ 
  fromSearchResponse: Record<string, any>;
  phoneSource: string; 
  hoursSource: string;
}> {
  const fromSearchResponse: Record<string, any> = {};

  let phoneSource = "service";
  let hoursSource = "service";

  // Phone Number Fallback

  if (!serviceInfo.phoneNumber?.length) {
    if (hasDivisions && serviceInfo.division) {
      const phoneNumbers = await contactDAO.getPhoneNumbersByDivision(
        serviceInfo.division.divisionID
      );

      if (phoneNumbers.length) {
        fromSearchResponse.phoneNumber = phoneNumbers[0];

        phoneSource = "division";
      }
    } else if (facilityInfo.phoneNumber?.length) {
      fromSearchResponse.phoneNumber = facilityInfo.phoneNumber[0];

      phoneSource = "facility";
    }
  } else {
    fromSearchResponse.phoneNumber = serviceInfo.phoneNumber[0];
  }

  // Operating Hours Fallback

  if (!serviceInfo.openingTime || !serviceInfo.closingTime) {
    if (hasDivisions && serviceInfo.division) {
      const { openingTime, closingTime } =
        await operatingHoursDAO.getByDivision(serviceInfo.division.divisionID);

      fromSearchResponse.openingTime = openingTime;
      fromSearchResponse.closingTime = closingTime;

      hoursSource = "division";
    } else {
      fromSearchResponse.openingTime = facilityInfo.openingTime;
      fromSearchResponse.closingTime = facilityInfo.closingTime;

      hoursSource = "facility";
    }
  } else {
    fromSearchResponse.openingTime = serviceInfo.openingTime;
    fromSearchResponse.closingTime = serviceInfo.closingTime;
  }

  // Facility Name

  fromSearchResponse.facilityName = facilityInfo.name;

  // Facility Address

  if (facilityInfo.address) {
    const [region, province, city, barangay] = await Promise.all([
      geographyDAO.getNameOfRegion(facilityInfo.address.regionID),
      geographyDAO.getNameOfProvince(facilityInfo.address.pOrCID),
      geographyDAO.getNameOfCOrM(facilityInfo.address.cOrMID),
      geographyDAO.getNameOfBrgy(facilityInfo.address.brgyID),
    ]);

    fromSearchResponse.address = {
      street: facilityInfo.address.street,
      region,
      province,
      city,
      barangay,
    };
  }

  return { fromSearchResponse, phoneSource, hoursSource };
}
