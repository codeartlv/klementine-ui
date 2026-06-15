import { attributes, element } from './../helpers.js';

export default function avatar(data = {}) {
	data = {
		...data,
	};

	return element(`<wa-avatar${attributes(data)}></wa-avatar>`);
}
