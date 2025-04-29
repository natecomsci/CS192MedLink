import { prisma } from "./prisma";

import type { Employee, Session } from '@prisma/client';

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

  async getByID(sessionID: string): Promise<{session: Session, employee: Employee }> {
    try {
      const sessionWithEmployee = await prisma.session.findUnique({
        where: { 
          sessionID
        },
        include: {
          employee: true // exposes every attribute afkdkf ginagaya ko lang template ng lucia
        }
      });
  
      if (!sessionWithEmployee) {
        throw new Error(`No Session linked to ID ${sessionID} found.`);
      }

      const { employee, ...session } = sessionWithEmployee;
  
      console.log(`Fetched Session ${sessionID} with Employee ${employee.employeeID}: `);

      return { session, employee };
    } catch (error) {
      console.error("Details: ", error);
      throw new Error("No database connection.");
    }
  }

  async getByEmployee(employeeID: string): Promise<Session[]> {
    try {
      const sessions = await prisma.session.findMany({
        where: { 
          employeeID
        }
      });
  
      console.log(`Result of "sessions" query for Employee ${employeeID}: `, sessions);

      console.log(`Fetched Sessions of Employee ${sessions}: `);

      return sessions;
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