import { attributes, element } from './../helpers.js';

export default function checkbox(data = {}) {
	data = {
		label: '',
		value: '1',
		checked: false,
		...data,
	};

	const blacklist = ['label'];
	const htmlString = `<wa-checkbox${attributes(data, blacklist)}>${data.label}</wa-checkbox>`;

	return element(htmlString);
}
