// to change to +page.server.ts when connecting to db
// https://svelte.dev/docs/kit/routing

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	if (params.id != undefined) {
		return {
			id: params.id,
		};
	}

	error(404, 'Not found');
};