import { prisma } from "../../src/lib/server/dataLayer/prisma";

import { Action } from "@prisma/client";

import { faker } from "@faker-js/faker";

import { updateLogDAO, getFacilities, getRandomDivisionIfAny } from "./seedersUtility";

export const types: string[] = [
  "General Consultation",
  "Blood Chemistry (BUA)",
  "Blood Chemistry (BUN)",
  "Blood Chemistry (Cholesterol)",
  "Blood Chemistry (FBS)",
  "Blood Chemistry (LDH)",
  "Blood Chemistry (LDL)",
  "Blood Chemistry (RBS)",
  "Blood Chemistry (Triglycerides)",
  "Complete Blood Count (CBC)",
  "Fecalysis",
  "Urinalysis",
  "Chest X-Ray (PA View)",
  "Chest X-Ray (AP/Lateral View)",
  "Skull X-Ray (AP/Lateral View)",
  "Cervical Spine X-Ray",
  "Lumbar Spine X-Ray",
  "Thoracic Spine X-Ray",
  "Abdominal Ultrasound",
  "Head CT Scan",
  "Chest CT Scan",
  "Brain CT Scan",
  "Cervical Spine CT Scan",
  "Lumbar Spine CT Scan",
  "Thoracic Spine CT Scan",
  "Brain MRI",
  "Cervical Spine MRI",
  "Lumbar Spine MRI",
  "Thoracic Spine MRI",
  "Tooth Extraction",
  "Temporary Filling",
  "Permanent Filling",
  "Root Canal Treatment",
  "Teeth Whitening",
  "Physical Therapy",
  "Occupational Therapy",
  "Chemotherapy",
  "Immunotherapy",
  "EEG",
  "ECG",
  "Dialysis",
  "Colonoscopy",
  "Gastroscopy",
  "Labor & Delivery",
  "Hepatitis A Vaccination",
  "Hepatitis B Vaccination",
  "HPV Vaccination",
  "Flu Vaccination",
  "Rabies Vaccination",
  "COVID-19 Vaccination",
];

export async function seedOutpatientService() {
  const facilities: {
    facilityID: string;
    employeeID: string;
  }[] = await getFacilities();

  let miscellaneous = 0;

  for (let i = 0; i < facilities.length; i++) {
    const { facilityID, employeeID } = facilities[i];

    if (!employeeID) {
      console.warn(`No Manager for facility ${facilityID}, skipping.`);
      continue;
    }

    const selectedTypes = faker.helpers.arrayElements(types, 25);

    for (const type of selectedTypes) {
      const serviceID = `outpatient-${type.replace(/\s+/g, "-")}-${facilityID}`;

      const divisionID = await getRandomDivisionIfAny(facilityID);

      await prisma.$transaction(async (tx) => {
        await tx.outpatientService.upsert({
          where: { 
            serviceID 
          },
          update: {},
          create: {
            service: {
              create: {
                serviceID,
                facilityID,
                type,

                ...(divisionID && { divisionID }),

                ...(faker.datatype.boolean() && {
                  note: faker.lorem.words({ min: 7, max: 14 }),
                })
              }
            },
            basePrice       : faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
            completionTimeD : faker.number.int({ min: 0, max:  2 }),
            completionTimeH : faker.number.int({ min: 0, max: 23 }),
            isAvailable     : faker.datatype.boolean(),
            acceptsWalkIns  : faker.datatype.boolean(),
          }
        });

        if (i % 2 === 1) {
          await updateLogDAO.create(
            {
              entity: type,
              action: Action.CREATE
            },
            facilityID,
            employeeID,
            tx
          );
        }
      });
    }
  }
}