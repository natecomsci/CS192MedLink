import { redirect, fail } from '@sveltejs/kit';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
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

        return { photoUrl: employee?.photo ?? "01" };
    } catch (error) {
        console.error(error);
        return { photoUrl: "0001" };
    }
};

export const actions = {
    signOut: async ({ cookies }) => {
        // Delete cookies for facility ID and services
        cookies.delete('facilityID', { path: '/' });
        cookies.delete('employeeID', { path: '/' });
        cookies.delete('role', { path: '/' });
        cookies.delete('hasAdmins', { path: '/' });
        cookies.delete('hasDivisions', { path: '/' });

        // Redirect to home or login page
        throw redirect(303, '/facility');
    },
    
    updatePassword: async ({ request, cookies }) => {
        const formData = await request.formData();
        const employeeID = cookies.get('employeeID');
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
    
        if (!employeeID || !currentPassword || !newPassword) {
            return fail(400, { error: 'Missing required fields.' });
        }
    
        try {
            // Get stored password hash
            const storedPassword = await employeeDAO.getPassword(employeeID);
            const isMatch = await bcrypt.compare(currentPassword.toString(), storedPassword);
    
            if (!isMatch) {
                return fail(401, { error: 'Incorrect current password.' });
            }
    
            // Update password
            await employeeDAO.updatePassword(employeeID, newPassword.toString());
            return { success: true, message: 'Password updated successfully.' };
        } catch (error) {
            console.error(error);
            return fail(500, { error: 'Failed to update password.' });
        }
    },
    updatePhoto: async ({ request, cookies }) => {
        const employeeID = cookies.get('employeeID');
        if (!employeeID) {
            return fail(401, { error: 'Unauthorized. Employee not found.' });
        }

        const formData = await request.formData();
        const photoFile = formData.get('employeeImage') as File;

        if (!photoFile || photoFile.size === 0) {
            return fail(400, { error: 'No image provided.' });
        }

        try {
            // Validate the image
            validateImage(photoFile);

            // Generate a unique file path
            const filePath = `employees/${employeeID}/${uuidv4()}`;

            // Upload image to Supabase
            const { error: uploadError } = await supabase.storage
                .from('employee-pictures')
                .upload(filePath, photoFile, { upsert: true });

            if (uploadError) {
                throw new Error(`Image upload failed: ${uploadError.message}`);
            }

            // Get public URL
            const { data } = supabase.storage
                .from('employee-pictures')
                .getPublicUrl(filePath);

            if (!data || !data.publicUrl) {
                throw new Error('Failed to retrieve image URL.');
            }

            const publicUrl = data.publicUrl;

            // Store the image URL in the database
            await employeeDAO.updatePhoto(employeeID, publicUrl);

            return { success: true, message: 'Profile photo updated successfully.', imageUrl: publicUrl };
        } catch (error) {
            console.error(error);

            // Ensure error is always a string for serialization
            const errorMessage = error instanceof Error ? error.message : String(error);

            return fail(400, { error: errorMessage });
        }
    },

    removePhoto: async ({ cookies }) => {
        const employeeID = cookies.get('employeeID');
        if (!employeeID) {
            return fail(401, { error: 'Unauthorized. Employee not found.' });
        }

        try {
            // Update the employee's photo to null in the database
            await employeeDAO.updatePhoto(employeeID, "https://placehold.co/1080x1080/png");

            return { success: true, message: 'Profile photo removed successfully.' };
        } catch (error) {
            console.error(error);
            return fail(400, { error: error instanceof Error ? error.message : 'Failed to remove profile photo.' });
        }
    }
    
} satisfies Actions;
