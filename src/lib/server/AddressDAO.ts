import { prisma } from "./prisma";

import { Prisma } from "@prisma/client"

import type { AddressDTO } from "./DTOs";

export class AddressDAO {
  async getByFacility(facilityID: string): Promise<AddressDTO> {
    try {
      const address = await prisma.address.findUnique({
        where: {
          facilityID
        },
        select: {
          regionID : true,
          pOrCID   : true,
          cOrMID   : true,
          brgyID   : true,
          street   : true,
        }
      });

      if (!address) {
        throw new Error(`No Address linked to Facility ${facilityID} found.`);
      }

      console.log(`Fetched Address of Facility ${facilityID}: `);

      return address;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async update(facilityID: string, data: AddressDTO, tx: Prisma.TransactionClient): Promise<void> {
    try {
      const address = await tx.address.update({
        where: { 
          facilityID 
        },
        data
      });

      console.log(`Updated Address of Facility ${facilityID}: `, address);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}
