import { attributes, element } from './../helpers.js';

export default function button(data = {}) {
	data = {
		label: '',
		type: 'button',
		...data,
	};

	const blacklist = ['label'];

	return element(`<wa-button${attributes(data, blacklist)}>${data.label}</wa-button>`);
}
