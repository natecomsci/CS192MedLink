import { prisma } from "./prisma";

import { ContactType } from "@prisma/client";

import type { ContactDTO, 
              CreateContactDTO,
            } from "./DTOs";

export class ContactDAO {
  // contact information fetching utility

  // gets both phone numbers and emails if the type input is not given

  private async getContacts(where: { facilityID?: string; divisionID?: string; serviceID?: string }, type?: ContactType): Promise<ContactDTO[]> {
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

  async create(data: CreateContactDTO): Promise<string> {
    try {
      const contact = await prisma.contact.create({
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

  async getAll(): Promise<ContactDTO[]> {
    console.log(`Fetched Contacts: `);

    return this.getContacts({});
  }

  async getByFacility(facilityID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Contacts of Facility ${facilityID}: `)

    return this.getContacts({ facilityID });
  }

  async getByDivision(divisionID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Contacts of Division ${divisionID}: `)

    return this.getContacts({ divisionID });
  }

  async getByService(serviceID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Contacts of Service ${serviceID}: `)

    return this.getContacts({ serviceID });
  }

  async getAllPhoneNumbers(): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers: `);

    return this.getContacts({}, ContactType.PHONE);
  }

  async getPhoneNumbersByFacility(facilityID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers of Facility ${facilityID}: `)

    return this.getContacts({ facilityID }, ContactType.PHONE);
  }

  async getPhoneNumbersByDivision(divisionID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers of Division ${divisionID}: `)

    return this.getContacts({ divisionID }, ContactType.PHONE);
  }
  
  async getPhoneNumbersByService(serviceID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Phone Numbers of Service ${serviceID}: `)

    return this.getContacts({ serviceID }, ContactType.PHONE);
  }

  async getAllEmails(): Promise<ContactDTO[]> {
    console.log(`Fetched Emails: `)
  
    return this.getContacts({}, ContactType.EMAIL);
  }

  async getEmailsByFacility(facilityID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Emails of Facility ${facilityID}: `)

    return this.getContacts({ facilityID }, ContactType.EMAIL);
  }

  async getEmailsByDivision(divisionID: string): Promise<ContactDTO[]> {
    console.log(`Fetched Emails of Division ${divisionID}: `)

    return this.getContacts({ divisionID }, ContactType.EMAIL);
  }
  
  async update(contactID: string, info: string): Promise<void> {
    try {
      await prisma.contact.update({
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
  
  async delete(contactID: string): Promise<void> {
    try {
      await prisma.contact.delete({ 
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