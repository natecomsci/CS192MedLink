import { prisma } from "$lib/server/prisma";
import { fail, redirect } from "@sveltejs/kit";
import bcrypt from "bcryptjs";

import { Role } from "@prisma/client";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const managerID = data.get("managerID");
    const fname = data.get("fname");
    const mname = data.get("mname");
    const lname = data.get("lname");
    const password = data.get("password");
    const facility = data.get("facility");

    if (!managerID || !fname || !mname || !lname || !password || !facility) {
      return fail(400, { error: "All fields are required." });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.toString(), salt);

      await prisma.employee.create({
        data: {
          employeeID : managerID.toString(),
          fname     : fname.toString(),
          mname     : mname.toString(),
          lname     : lname.toString(),
          password  : hashedPassword,
          facility  : {
            connect: {
              facilityID: facility
            }
          },

          role: Role.MANAGER
        }
      });

      throw redirect(303, "/facility");
    } catch (error) {
      console.error("Error inserting facility:", error);
      return fail(500, { error: "Database Error " });
    }
  },
};
