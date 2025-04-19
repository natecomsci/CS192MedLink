import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { ContactType } from "@prisma/client";

import type { CreateContactDTO,
            } from "./DTOs";

type EntityType = "facility" | "division" | "service";

export class ContactDAO {
  // contact information fetching utility

  // gets both phone numbers and emails if the type input is not given

  private async getContactsByType(type: ContactType, where?: { facilityID?: string; divisionID?: string; }): Promise<string[]> {
    try {

      const contacts = await prisma.contact.findMany({
        where: {
          ...where,
          type
        },
        select: {
          info: true
        }
      });

      return contacts.map((contact: { info: string }) => contact.info);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getAllPhoneNumbers(): Promise<string[]> {
    console.log(`Fetched Phone Numbers: `);

    return this.getContactsByType(ContactType.PHONE);
  }

  async getPhoneNumbersByFacility(facilityID: string): Promise<string[]> {
    console.log(`Fetched Phone Numbers of Facility ${facilityID}: `)

    return this.getContactsByType(ContactType.PHONE, { facilityID });
  }

  async getPhoneNumbersByDivision(divisionID: string): Promise<string[]> {
    console.log(`Fetched Phone Numbers of Division ${divisionID}: `)

    return this.getContactsByType(ContactType.PHONE, { divisionID });
  }

  async getAllEmails(): Promise<string[]> {
    console.log(`Fetched Emails: `)
  
    return this.getContactsByType(ContactType.EMAIL);
  }

  async getEmailsByFacility(facilityID: string): Promise<string[]> {
    console.log(`Fetched Emails of Facility ${facilityID}: `)

    return this.getContactsByType(ContactType.EMAIL, { facilityID });
  }

  async getEmailsByDivision(divisionID: string): Promise<string[]> {
    console.log(`Fetched Emails of Division ${divisionID}: `)

    return this.getContactsByType(ContactType.EMAIL, { divisionID });
  }

  async createMany(entity: EntityType, relatedID: string, data: CreateContactDTO[], tx: Prisma.TransactionClient): Promise<void> {
    try {
      await tx.contact.createMany({
        data: data.map((contactInformation) => ({
          ...contactInformation,

          [`${entity}ID`]: relatedID
        }))
      });

      console.log(`Creation of Contacts related to ${entity.charAt(0).toUpperCase() + entity.slice(1)} ${relatedID} successful.`); // wag na ireturn
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async deleteMany(entity: EntityType, relatedID: string, type: ContactType, tx: Prisma.TransactionClient): Promise<void> {
    try {
      await tx.contact.deleteMany({
        where: {
          [`${entity}ID`]: relatedID,
          type
        }
      });

      console.log(`Deletion of Contacts related to ${entity.charAt(0).toUpperCase() + entity.slice(1)} ${relatedID} successful.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}