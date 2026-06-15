import { attributes, element } from '../helpers.js';

export default function spinner(data = {}) {
	data = {
		...data,
	};

	const blacklist = [];

	return element(`<wa-spinner${attributes(data, blacklist)}></wa-spinner>`);
}
