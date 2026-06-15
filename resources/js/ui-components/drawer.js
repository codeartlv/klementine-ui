import OverlayLoader, { overlayShell } from '../lib/overlay-loader.js';

export function drawerShell(data = {}) {
	return overlayShell('wa-drawer', data);
}

export default class Drawer extends OverlayLoader {
	constructor(params = {}) {
		const mergedParams = {
			id: 'drawer',
			caption: 'Drawer',
			...params,
		};

		super(mergedParams, {
			tagName: 'wa-drawer',
			globalKey: 'ActiveDrawerInstance',
			cssPrefix: 'drawer',
		});
	}

	_getShellData(options = {}) {
		const data = super._getShellData(options);

		if (options.placement) {
			data.placement = options.placement;
		}

		if (options.contained) {
			data.contained = true; // For boolean HTML attributes
		}

		return data;
	}

	_applyOptions(overlayEl, options) {
		super._applyOptions(overlayEl, options);

		if (options.placement) {
			overlayEl.setAttribute('placement', options.placement);
		}

		if (options.contained) {
			overlayEl.setAttribute('contained', '');
		}
	}
}
