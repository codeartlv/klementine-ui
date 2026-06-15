import { attributes, element } from './../helpers.js';

export default function badge(data = {}) {
	data = {
		label: '',
		variant: 'primary',
		...data,
	};

	const blacklist = ['label'];

	return element(`<wa-badge${attributes(data, blacklist)}>${data.label}</wa-badge>`);
}
