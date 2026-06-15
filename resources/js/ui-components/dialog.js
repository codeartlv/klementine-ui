import OverlayLoader, { overlayShell } from '../lib/overlay-loader.js';

export function dialogShell(data = {}) {
	return overlayShell('wa-dialog', data);
}

export default class Dialog extends OverlayLoader {
	constructor(params = {}) {
		const mergedParams = {
			id: 'dialog',
			caption: 'Dialog',
			...params,
		};

		super(mergedParams, {
			tagName: 'wa-dialog',
			globalKey: 'ActiveDialogInstance',
			cssPrefix: 'dialog',
		});
	}
}
