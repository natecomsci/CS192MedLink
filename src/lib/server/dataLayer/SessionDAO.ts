import { prisma } from "./prisma";

import type { Session } from '@prisma/client';

export class SessionDAO {
  async create(sessionID: string, employeeID: string, expiresAt: Date): Promise<Session> {
    try {
      return await prisma.session.create({
        data: {
          sessionID, employeeID, expiresAt
        }
      })
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getByID(sessionID: string): Promise<Session> {
    try {
      const session = await prisma.session.findUnique({
        where: { 
          sessionID
        },
        include: {
          employee: true // exposes every attribute afkdf ginagaya ko lang template ng lucia
        }
      });
  
      if (!session) {
        throw new Error(`No Session linked to ID ${sessionID} found.`);
      }

      console.log(`Fetched Employee ${sessionID}: `);

      return session;
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async updateExpiresAt(sessionID: string, expiresAt: Date): Promise<void> {
    try {
      await prisma.session.update({
        where: { 
          sessionID 
        },
        data: { 
          expiresAt
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async delete(sessionID: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { 
          sessionID 
        }
      });
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }
}