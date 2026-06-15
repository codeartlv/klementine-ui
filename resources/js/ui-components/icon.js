import { attributes, element } from '../helpers.js';

export default function icon(data = {}) {
	data = {
		name: '',
		...data,
	};

	const blacklist = ['name'];

	return element(`<wa-icon name="${data.name}"${attributes(data, blacklist)}></wa-icon>`);
}
