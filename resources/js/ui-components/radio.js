import { attributes, element } from './../helpers.js';

export default function radio(data = {}) {
	data = {
		label: '',
		value: '1',
		checked: false,
		...data,
	};

	const blacklist = ['label'];

	return element(`<wa-radio${attributes(data, blacklist)}>${data.label}</wa-radio>`);
}
