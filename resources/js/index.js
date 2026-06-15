import Alpine from 'alpinejs';
import axios from 'axios';

import { setBasePath } from '@awesome.me/webawesome/dist/utilities/base-path.js';
import { registerIconLibrary } from '@awesome.me/webawesome/dist/webawesome.js';

import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/input/input.js';
import '@awesome.me/webawesome/dist/components/drawer/drawer.js';
import '@awesome.me/webawesome/dist/components/divider/divider.js';
import '@awesome.me/webawesome/dist/components/dropdown/dropdown.js';
import '@awesome.me/webawesome/dist/components/select/select.js';
import '@awesome.me/webawesome/dist/components/option/option.js';
import '@awesome.me/webawesome/dist/components/checkbox/checkbox.js';
import '@awesome.me/webawesome/dist/components/radio-group/radio-group.js';
import '@awesome.me/webawesome/dist/components/radio/radio.js';
import '@awesome.me/webawesome/dist/components/textarea/textarea.js';
import '@awesome.me/webawesome/dist/components/callout/callout.js';
import '@awesome.me/webawesome/dist/components/switch/switch.js';
import '@awesome.me/webawesome/dist/components/avatar/avatar.js';
import '@awesome.me/webawesome/dist/components/badge/badge.js';
import '@awesome.me/webawesome/dist/components/dialog/dialog.js';
import '@awesome.me/webawesome/dist/components/spinner/spinner.js';

export class KlementineUI {
	static #instance = null;

	constructor() {
		if (KlementineUI.#instance) {
			return KlementineUI.#instance;
		}

		this.started = false;

		this.setupAlpine();
		this.setupWebAwesome();
		this.setupAxios();

		KlementineUI.#instance = this;
	}

	static getInstance() {
		if (!KlementineUI.#instance) {
			new KlementineUI();
		}

		return KlementineUI.#instance;
	}

	loadAlpineComponents(modules) {
		const userPromises = Object.entries(modules).map(([path, resolver]) => {
			const componentName = path.split('/').pop().replace('.js', '');

			return resolver().then((module) => {
				window.Alpine.data(componentName, module.default);
			});
		});

		this.componentPromises.push(...userPromises);

		return this;
	}

	setupAlpine() {
		// *** Alpine.js Integration ***
		// Initialize Alpine.js and set it to the global window object
		window.Alpine = Alpine;
		this.setupCallbacks = [];

		const modules = import.meta.glob('./alpine-components/*.js');

		this.componentPromises = Object.entries(modules).map(([path, resolver]) => {
			const componentName = path.split('/').pop().replace('.js', '');

			return resolver().then((module) => {
				Alpine.data(componentName, module.default);
			});
		});
	}

	configureAlpine(callback) {
		if (typeof callback === 'function') {
			this.setupCallbacks.push(callback);
		}

		return this;
	}

	configureWebAwesome(callback) {
		callback(registerIconLibrary);

		return this;
	}

	setupWebAwesome() {
		// *** WebAwesome Integration ***
		const webAwesomeBasePath = import.meta.env.DEV
			? 'http://localhost:5173/build/webawesome'
			: '/build/webawesome';

		setBasePath(webAwesomeBasePath);
	}

	setupAxios() {
		window.axios = axios;
		window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		let token = document.head.querySelector('meta[name="csrf-token"]');

		if (token) {
			window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
		}
	}

	start() {
		if (this.started) {
			return this;
		}

		this.started = true;

		Promise.all(this.componentPromises).then(() => {
			this.setupCallbacks.forEach((callback) => callback(window.Alpine));

			window.Alpine.start();
		});

		return this;
	}
}

export default KlementineUI.getInstance();
