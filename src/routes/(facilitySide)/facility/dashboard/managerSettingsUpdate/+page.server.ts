import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    signOut: async ({ cookies }) => {
        // Delete cookies for facility ID and services
        cookies.delete('facilityID', { path: '/' });
        cookies.delete('services', { path: '/' });
        cookies.delete('hasAdmins', { path: '/' });
        cookies.delete('hasDivisions', { path: '/' });

        // Redirect to home or login page
        throw redirect(303, '/facility');
    }
} satisfies Actions;
