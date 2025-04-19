import { prisma } from "./prisma";

import type { Prisma } from "@prisma/client";

import { ContactType } from "@prisma/client";

import type { ContactDTO, 
              CreateContactDTO,
            } from "./DTOs";

export class ContactDAO {
  // contact information fetching utility

  // gets both phone numbers and emails if the type input is not given

  private async getContactsByType(type: ContactType, where?: { facilityID?: string; divisionID?: string; serviceID?: string }): Promise<ContactDTO[]> {
    try {
      const select = {
        contactID : true,
        info      : true,

        ...(type ? {} : { type: true })
      };

      return await prisma.contact.findMany({
        where: {
          ...where,

          ...(type && { type })
        },
        select
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async create(data: CreateContactDTO, tx: Prisma.TransactionClient): Promise<string> {
    try {
      const contact = await tx.contact.create({
        data,
        select: {
          contactID: true
        }
      });

      return contact.contactID;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getAllPhoneNumbers(): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers: `);

    return this.getContactsByType(ContactType.PHONE);
  }

  async getPhoneNumbersByFacility(facilityID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers of Facility ${facilityID}: `)

    return this.getContactsByType(ContactType.PHONE, { facilityID });
  }

  async getPhoneNumbersByDivision(divisionID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers of Division ${divisionID}: `)

    return this.getContactsByType(ContactType.PHONE, { divisionID });
  }
  
  async getPhoneNumbersByService(serviceID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers of Service ${serviceID}: `)

    return this.getContactsByType(ContactType.PHONE, { serviceID });
  }

  async getAllEmails(): Promise<ContactDTO[]> {
    console.log(`Fetched Emails: `)
  
    return this.getContactsByType(ContactType.EMAIL);
  }

  async getEmailsByFacility(facilityID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Emails of Facility ${facilityID}: `)

    return this.getContactsByType(ContactType.EMAIL, { facilityID });
  }

  async getEmailsByDivision(divisionID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Emails of Division ${divisionID}: `)

    return this.getContactsByType(ContactType.EMAIL, { divisionID });
  }
  
  async update(contactID: string, info: string, tx: Prisma.TransactionClient): Promise<void> {
    try {
      await tx.contact.update({
        where: { 
          contactID 
        },
        data: {
          info
        },
      });
  
      console.log(`Update of Contact ${contactID} successful.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
  
  async delete(contactID: string, tx: Prisma.TransactionClient): Promise<void> {
    try {
      await tx.contact.delete({ 
        where: { 
          contactID 
        } 
      });

      console.log(`Deletion of Contact ${contactID} successful.`);
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}