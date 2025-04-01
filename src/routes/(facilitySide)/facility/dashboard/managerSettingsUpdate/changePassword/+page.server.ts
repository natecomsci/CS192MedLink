import { redirect, fail } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

import type { Actions, PageServerLoad } from './$types';

import { EmployeeDAO, validateImage } from '$lib';

const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
const employeeDAO = new EmployeeDAO();


export const load: PageServerLoad = async ({ cookies }) => {
    const employeeID = cookies.get('employeeID');

    if (!employeeID) {
        return { photoUrl: "02" };
    }

    try {
        // Directly query the database instead of calling employeeDAO.getPhoto()
        const employee = await prisma.employee.findUnique({
            where: { employeeID },
            select: { photo: true }
        });

        return { photoUrl: employee?.photo?? "01" };
    } catch (error) {
        console.error(error);
        return { photoUrl: "0001" };
    }
};

export const actions = {    
    updatePassword: async ({ request, cookies }) => {
        const formData = await request.formData();
        const employeeID = cookies.get('employeeID');
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');

        if (!employeeID || !currentPassword || !newPassword) {
            return fail(400, { message: 'Missing required fields.' });
        }

        try {
            // Get stored password hash
            const storedPassword = await employeeDAO.getPassword(employeeID);
            const isMatch = await bcrypt.compare(currentPassword.toString(), storedPassword);

            if (!isMatch) {
                return fail(401, { message: 'Incorrect current password.' });
            }

            // Update password
            await employeeDAO.updatePassword(employeeID, newPassword.toString());
            return { success: true, message: 'Password updated successfully.' };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to update password.' });
        }
    },
} satisfies Actions;
