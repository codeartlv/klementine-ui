import { EventEmitter } from '../helpers.js';

export default class FormHandler {
	form = null;
	state = null;
	request = null;
	_events = new EventEmitter();

	constructor(formElement, settings) {
		this.form = formElement;
		this.settings = { ...settings };

		this.form.addEventListener('submit', async (e) => {
			e.preventDefault();

			try {
				await this.submit(e.submitter);
			} catch (_) {}
			return false;
		});
	}

	on(...args) {
		return this._events.on(...args);
	}

	trigger(...args) {
		return this._events.trigger(...args);
	}

	started() {
		this.state = 'loading';
		this.trigger('start');
	}

	ended() {
		if (this.state !== 'success' && this.state !== 'error') {
			this.state = 'idle';
		}

		this.request = null;
		this.trigger('complete');
	}

	failed(status, message) {
		this.state = 'error';
		this.trigger('failed', status, message);
	}

	succeeded(response) {
		this.state = 'success';
		this.trigger('loaded', response);
	}

	progress(percent) {
		this.trigger('progress', percent);
	}

	send(method, url, formData) {
		return new Promise((resolve, reject) => {
			this.request = new XMLHttpRequest();
			this.request.open(method, url, true);

			this.request.onload = () => {
				if (this.request.status >= 200 && this.request.status < 300) {
					try {
						const jsonResponse = JSON.parse(this.request.responseText);
						resolve(jsonResponse);
					} catch (e) {
						reject(`Failed to parse JSON response: ${e}`);
					}
				} else {
					reject(this.request.statusText || `HTTP ${this.request.status}`);
				}
			};

			this.request.onerror = () => reject(this.request.statusText || 'Network error');
			this.request.ontimeout = () => reject('Timeout');
			this.request.onabort = () => reject('Aborted');

			this.request.upload?.addEventListener('progress', (evt) => {
				if (evt.lengthComputable) {
					const pct = Math.round((evt.loaded / evt.total) * 100);
					this.progress(pct);
				}
			});

			this.request.send(formData);
		});
	}

	async submit(submitter) {
		if (this.state === 'loading' && this.request) {
			this.request.abort();
		}

		this.started();

		const recaptchaEl = this.form.querySelector('[data-recaptcha-token]');
		if (recaptchaEl) {
			try {
				const action = recaptchaEl.dataset.recaptchaToken || '';
				const token = await window.loadRecaptcha(action);
				recaptchaEl.value = token;
			} catch (err) {
				this.failed(0, `reCAPTCHA error: ${err?.message || err}`);
				this.ended();
				return;
			}
		}

		const formData = new FormData(this.form);
		const method = this.form.method || 'POST';
		const url = this.form.action || '';

		if (submitter && submitter.name && submitter.value) {
			formData.append(submitter.name, submitter.value);
		}

		try {
			const response = await this.send(method, url, formData);
			this.succeeded(response);
		} catch (error) {
			this.failed(this.request?.status || 0, error);
		} finally {
			this.ended();
		}
	}
}
