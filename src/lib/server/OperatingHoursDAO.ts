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
        throw new Error("No Operating Hours found.");
      }

      const { openingTime, closingTime } = hours;

      if ((!openingTime) || (!closingTime)) {
        throw new Error("Incomplete Operating Hour details.");
      }

      console.log(`Operating Hours of Facility ${facilityID}: `, {
        openingTime,
        closingTime,
      });

      return { openingTime, closingTime };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Operating Hours of the Facility.");
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
        throw new Error("No Operating Hours found.");
      }

      const { openingTime, closingTime } = hours;

      if ((!openingTime) || (!closingTime)) {
        throw new Error("Incomplete Operating Hour details.");
      }

      console.log(`Operating Hours of Division ${divisionID}: `, {
        openingTime,
        closingTime,
      });

      return { openingTime, closingTime };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("Could not get Operating Hours of the Division.");
    }
  }
}