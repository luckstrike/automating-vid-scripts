import { error } from '@sveltejs/kit'

export function load({ params }) {
	if (params.docId) {
		return {
            docId: params.docId
		};
	}

	error(404, 'Not found');
}