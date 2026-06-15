import axios from 'axios';
import { EventEmitter, element, attributes, addSpinner } from '../helpers.js';

import button from '../ui-components/button.js';
import callout from '../ui-components/callout.js';

export function overlayShell(tagName, data = {}) {
	data = {
		label: '',
		...data,
	};

	return element(`<${tagName}${attributes(data)}></${tagName}>`);
}

export default class OverlayLoader {
	#events = new EventEmitter();
	#tagName;
	#globalKey;
	#cssPrefix;

	constructor(params = {}, config = {}) {
		this.id = params.id;
		this.caption = params.caption;
		this.overlayElement = null;
		this.loadingOverlay = null;

		this.#tagName = config.tagName || 'wa-dialog';
		this.#globalKey = config.globalKey || 'ActiveOverlayInstance';
		this.#cssPrefix = config.cssPrefix || 'overlay';
	}

	on(...args) {
		return this.#events.on(...args);
	}

	trigger(...args) {
		return this.#events.trigger(...args);
	}

	showLoading() {
		if (this.loadingOverlay) return;

		this.loadingOverlay = document.createElement('div');
		this.loadingOverlay.classList.add('window-overlay');
		addSpinner(this.loadingOverlay, 'xl', 'white');

		document.body.appendChild(this.loadingOverlay);
		this.loadingOverlay.offsetHeight;
		this.loadingOverlay.style.opacity = '1';
	}

	hideLoading() {
		if (!this.loadingOverlay) return;

		this.loadingOverlay.style.opacity = '0';

		const overlayToRemove = this.loadingOverlay;
		this.loadingOverlay = null;

		setTimeout(() => overlayToRemove.remove(), 250);
	}

	close() {
		return new Promise((resolve, reject) => {
			if (!this.overlayElement) {
				reject();
				return;
			}

			this.overlayElement.addEventListener('wa-after-hide', () => resolve(), { once: true });
			this.overlayElement.open = false;
		});
	}

	_applyOptions(overlayEl, options) {
		if (options.autoclose) {
			overlayEl.lightDismiss = true;
		}

		if (!options.animations) {
			overlayEl.style.setProperty('--show-duration', '0ms');
			overlayEl.style.setProperty('--hide-duration', '0ms');
		}
	}

	_getShellData(options = {}) {
		const data = { label: this.caption };

		if (options.autoclose) {
			data['light-dismiss'] = true;
		}

		return data;
	}

	#parseResponse(htmlString, options) {
		const template = document.createElement('template');
		template.innerHTML = htmlString.trim();

		const existingOverlay = template.content.querySelector(this.#tagName);

		if (existingOverlay) {
			return existingOverlay;
		}

		// 3. Update internal call
		const overlayEl = overlayShell(this.#tagName, this._getShellData(options));

		while (template.content.firstChild) {
			overlayEl.appendChild(template.content.firstChild);
		}

		return overlayEl;
	}

	#buildErrorOverlay(message) {
		const overlayEl = overlayShell(this.#tagName, { label: 'Error' });
		overlayEl.appendChild(callout({ message, variant: 'danger' }));

		const closeBtn = button({
			label: 'Close',
			variant: 'brand',
			[`data-${this.#cssPrefix}`]: 'close',
		});

		closeBtn.slot = 'footer';
		overlayEl.appendChild(closeBtn);

		return overlayEl;
	}

	#mountOverlay(overlayEl, urlOrElement, options) {
		if (this.id) {
			overlayEl.classList.add(`${this.#cssPrefix}--${this.id}`);
		}

		this.overlayElement = overlayEl;
		this._applyOptions(overlayEl, options);

		return new Promise((resolve) => {
			overlayEl.addEventListener('wa-after-show', () => {
				if (window.Alpine) {
					window.Alpine.initTree(overlayEl);
				}

				document.dispatchEvent(
					new CustomEvent('app:contentLoad', {
						detail: { source: this.#cssPrefix, element: overlayEl },
					}),
				);

				resolve(overlayEl);
			});

			overlayEl.addEventListener('wa-after-hide', () => {
				this.trigger('close');
				window[this.#globalKey] = null;

				if (typeof urlOrElement === 'string') {
					overlayEl.remove();
				}
			});
		});
	}

	open(urlOrElement, options = {}) {
		options = {
			animations: true,
			autoclose: false,
			...options,
		};

		return new Promise((resolve, reject) => {
			const processOpen = async () => {
				let overlayEl = null;

				window[this.#globalKey] = this;
				this.trigger('open');

				localStorage.setItem('revertScrollPosition', String(window.scrollY));

				try {
					if (typeof urlOrElement === 'string') {
						this.showLoading();

						let htmlString = '';

						try {
							const response = await axios.get(urlOrElement);
							htmlString = response.data;
						} catch (e) {
							const message = e.response?.data?.message || e.message;
							overlayEl = this.#buildErrorOverlay(message);
						} finally {
							this.hideLoading();
						}

						if (!overlayEl) {
							overlayEl = this.#parseResponse(htmlString, options);
						}

						document.body.appendChild(overlayEl);
					} else if (urlOrElement instanceof HTMLElement) {
						if (urlOrElement.localName === this.#tagName) {
							overlayEl = urlOrElement;
						} else {
							overlayEl = overlayShell(this.#tagName, this._getShellData(options));
							overlayEl.appendChild(urlOrElement);
							document.body.appendChild(overlayEl);
						}
					} else {
						reject(new TypeError('urlOrElement must be a URL string or HTMLElement'));
						return;
					}

					const mountPromise = this.#mountOverlay(overlayEl, urlOrElement, options);

					await customElements.whenDefined(this.#tagName);
					overlayEl.open = true;

					resolve(await mountPromise);
				} catch (e) {
					window[this.#globalKey] = null;
					reject(e);
				}
			};

			if (window[this.#globalKey]) {
				window[this.#globalKey].close().then(processOpen).catch(processOpen);
			} else {
				processOpen();
			}
		});
	}
}
