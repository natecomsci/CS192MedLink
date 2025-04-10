import { prisma } from "./prisma";

export class OperatingHoursDAO {
  async getByFacility(facilityID: string): Promise<{ openingTime: Date, closingTime: Date }> {
    try {
      const hours = await prisma.facility.findUnique({
        where: {
          facilityID
        },
        select: {
          openingTime : true,
          closingTime : true,
        }
      });

      if (!hours) {
        throw new Error(`No Operating Hours linked to Facility ${facilityID} found.`);
      }

      const { openingTime, closingTime } = hours;

      if (!openingTime || !closingTime) {
        throw new Error("Incomplete Operating Hour details.");
      }

      console.log(`Fetched Operating Hours of Facility ${facilityID}: `);

      return { openingTime, closingTime };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getByDivision(divisionID: string): Promise<{ openingTime: Date, closingTime: Date }> {
    try {
      const hours = await prisma.division.findUnique({
        where: {
            divisionID
        },
        select: {
          openingTime : true,
          closingTime : true,
        }
      });

      if (!hours) {
        throw new Error(`No Operating Hours linked to Division ${divisionID} found.`);
      }

      const { openingTime, closingTime } = hours;

      if (!openingTime || !closingTime) {
        throw new Error("Incomplete Operating Hour details.");
      }

      console.log(`Fetched Operating Hours of Division ${divisionID}: `);

      return { openingTime, closingTime };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}