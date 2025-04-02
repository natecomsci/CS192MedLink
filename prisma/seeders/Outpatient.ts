import { PrismaClient } from "@prisma/client";

import { Load, Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { FacilityDAO } from "../../src/lib/server/FacilityDAO";

import { UpdateLogDAO } from "../../src/lib/server/UpdateLogDAO";

const prisma = new PrismaClient();

const facilityDAO = new FacilityDAO();

const updateLogDAO = new UpdateLogDAO();

export const types: string[] = [
    "General Consultation",
    "Blood Chemistry (BUA)",
    "Complete Blood Count (CBC)",
    "Clinical Fecalysis",
    "Clinical Urinalysis",
    "Chest X-Ray (PA View)",
    "Cervical Spine X-Ray",
    "Thoracic Spine X-Ray",
    "Lumbar Spine X-Ray",
    "Abdominal Ultrasound",
    "Head CT Scan",
    "Cervical Spine CT Scan",
    "Thoracic Spine CT Scan",
    "Lumbar Spine CT Scan",
    "Brain MRI",
    "Dental Scaling",
    "Physical Therapy",
    "Oncology Chemotherapy",
    "EEG",
    "ECG",
    "Dialysis",
    "Colonoscopy",
    "Gastroscopy",
    "Labor & Delivery",
    "COVID-19 Vaccination",
  ];

export async function seedOutpatientService() {
  const facilities = await prisma.facility.findMany({
    include: {
      divisions: true,
      employees: {
        where: {
          role: "MANAGER"
        },
        select: { 
          employeeID: true 
        }
      }
    }
  });

  let i = 0;
  let miscellaneous = 0;

  for (const facility of facilities) {
    const selectedTypes = faker.helpers.arrayElements(types, 15);

    const hasDivision = await facilityDAO.facilityHasDivisions(facility.facilityID);

    const employeeID = facility.employees[0]?.employeeID;

    for (const type of selectedTypes) {
      const serviceID = `outpatient-${type.replace(/\s+/g, "-")}-${facility.facilityID}`;

      await prisma.$transaction(async (tx) => {
        let note = null;

        if (miscellaneous < 3) {
          note = faker.lorem.words({ min: 7, max: 14 });

          miscellaneous++;
        }

        await tx.outpatientService.upsert({
          where: { 
            serviceID 
          },
          update: {},
          create: {
            service: {
              create: {
                serviceID,
                facilityID : facility.facilityID,
                type,
                note,

                ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
              }
            },
            basePrice       : faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
            completionTimeD : faker.number.int({ min: 0, max:  2 }),
            completionTimeH : faker.number.int({ min: 0, max: 23 }),
            isAvailable     : faker.datatype.boolean(),
            acceptsWalkIns  : faker.datatype.boolean(),
          }
        });

        if (!employeeID) {
          console.warn(`No Manager found for facility ${facility.facilityID}. Skipping update log.`);
        }

        if (employeeID) {
          await updateLogDAO.create(
            {
              entity: type,
              action: Action.CREATE,
              ...(hasDivision && { divisionID: facility.divisions[0].divisionID })
            },
            facility.facilityID,
            employeeID,
            tx
          );
        }
      });
    }
  }
}