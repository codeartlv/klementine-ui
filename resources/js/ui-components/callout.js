import { attributes, element } from '../helpers.js';
import icon from './icon.js';

export default function callout(data = {}) {
	data = {
		title: '',
		message: '',
		variant: '',
		size: 'm',
		...data,
	};

	const iconMap = {
		success: 'check',
		danger: 'circle-xmark',
		warning: 'exclamation-triangle',
	};

	const iconName = iconMap[data.variant] || null;
	const blacklist = ['title', 'message', 'size'];

	let html = '<div>';

	if (iconName) {
		html += icon({ name: iconName, size: data.size }).outerHTML;
	}

	html += '<div>';

	if (data.title) {
		html += `<strong>${data.title}</strong>`;
	}

	html += `${data.message}</div></div>`;

	return element(`<wa-callout variant="${data.variant}"${attributes(data, blacklist)}>${html}</wa-callout>`);
}
