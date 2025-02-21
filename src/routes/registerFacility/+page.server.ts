import {prisma} from '$lib/server/prisma';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions = {
  default: async ({ request }) => { // ✅ Make this the default action
    const data = await request.formData();
    const hospitalID = data.get('hospitalID');
    const name = data.get('name');
    const password = data.get('password');

    if (!hospitalID || !name || !password) {
      return fail(400, { error: 'All fields are required' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password.toString(), 10);

      // Insert into the database (only hospitalID, name, and password)
      await prisma.Facility.create({
        data: {
          facilityID: hospitalID.toString(),
          name: name.toString(),
          password: hashedPassword,
        },
      });

      throw redirect(303, '/facility'); // Redirect after successful registration
    } catch (error) {
      console.error('Error inserting facility:', error);
      return fail(500, { error: 'Database error' });
    }
  },
};
