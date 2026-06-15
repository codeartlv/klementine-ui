import crc32 from 'crc-32';
import FormHandler from '../lib/form-handler.js';

import { waitForScrollEnd, addSpinner, removeSpinner, EventEmitter } from '../helpers.js';
import callout from '../ui-components/callout.js';

export default (settings) => ({
	form: null,
	submitButton: null,
	events: new EventEmitter(),
	handler: null,
	isSubmitting: false,
	startingCrc: null,
	currentCrc: null,
	beforeUnloadHandler: null,
	unloadWarningEnabled: false,

	init() {
		this.settings = {
			overlay: 'button',
			focus: null,
			scroll: true,
			alert: false,
			...settings,
		};

		this.beforeUnloadHandler = (event) => {
			if (this.startingCrc !== this.currentCrc && !this.isSubmitting) {
				event.preventDefault();
				event.returnValue = true;
			}
		};

		this.startingCrc = null;
		this.currentCrc = null;

		if (this.settings.alert) {
			this.$nextTick(() => {
				this.startingCrc = this.getFormChecksum();
				this.currentCrc = this.startingCrc;
			});

			this.$el.addEventListener('input', () => {
				this.currentCrc = this.getFormChecksum();
				const isDirty = this.currentCrc !== this.startingCrc;

				if (isDirty && !this.unloadWarningEnabled) {
					window.addEventListener('beforeunload', this.beforeUnloadHandler);
					this.unloadWarningEnabled = true;
				}

				if (!isDirty && this.unloadWarningEnabled) {
					window.removeEventListener('beforeunload', this.beforeUnloadHandler);
					this.unloadWarningEnabled = false;
				}
			});
		}

		this.handler = new FormHandler(this.$el, this.settings);

		this.handler.on('start', () => this.onStart());
		this.handler.on('complete', () => this.onComplete());
		this.handler.on('loaded', (response) => this.onSuccess(response));
		this.handler.on('failed', (status, message) => this.onError(status, message));

		const button = this.$el.querySelector('*[type="submit"]');

		if (button) {
			this.submitButton = button;
		} else if (this.settings.overlay === 'button') {
			this.settings.overlay = 'overlay';
		}

		if (this.settings.focus) {
			const field = this.$el.querySelector(`[name="${this.settings.focus}"]`);
			if (field) field.focus();
		}

		this.$el.addEventListener('do-submit', (e) => {
			this.handler.submit(e.detail && (e.detail.submitter || null));
		});
	},

	setupUnloadWarning() {
		window.addEventListener('beforeunload', (event) => {
			if (this.startingCrc !== this.currentCrc && !this.isSubmitting) {
				event.preventDefault();
			}
		});
	},

	getFormChecksum() {
		const form = this.$el;
		const values = Array.from(form.elements)
			.filter((el) => el.name && !el.disabled)
			.map((el) => (el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value))
			.join('|');

		return crc32.str(values);
	},

	on(event, callback) {
		return this.events.on(event, callback);
	},

	trigger(event, ...args) {
		return this.events.trigger(event, ...args);
	},

	onStart() {
		this.isSubmitting = true;

		this.resetState();
		this.$el.classList.add('loading', `loading-${this.settings.overlay}`);

		if (this.settings.overlay === 'button' && this.submitButton) {
			this.submitButton.setAttribute('loading', true);
		} else {
			addSpinner(this.$el);
		}
	},

	onComplete() {
		this.isSubmitting = false;
		this.$el.classList.remove('loading', `loading-${this.settings.overlay}`);

		if (this.settings.overlay === 'button' && this.submitButton) {
			this.submitButton.removeAttribute('loading');
		} else {
			removeSpinner(this.$el);
		}
	},

	onSuccess(response) {
		response = {
			status: false,
			fields: {},
			...response,
		};

		if (response.status === false) {
			this.showError(response);
			this.trigger('error', response);
		} else if (response.status === true) {
			this.showSuccess(response);
			this.trigger('success', response);
		}

		this.startingCrc = this.getFormChecksum();
		this.currentCrc = this.startingCrc;

		if (this.unloadWarningEnabled) {
			window.removeEventListener('beforeunload', this.beforeUnloadHandler);
			this.unloadWarningEnabled = false;
		}
	},

	onError(status, message) {
		this.showError({
			status: false,
			fields: { '*': [`${status}: ${message}`] },
		});
	},

	getMessageContainer() {
		let container = this.$el.querySelector('[data-role="form.response"]');
		if (!container) {
			container = document.createElement('div');
			container.dataset.role = 'form.response';
			this.$el.prepend(container);
		}
		return container;
	},

	resetState() {
		const container = this.getMessageContainer();
		container.innerHTML = '';

		this.$el.querySelectorAll('.is-invalid').forEach((element) => {
			element.classList.remove('is-invalid');
		});

		this.$el.querySelectorAll('[data-role="field.message"]').forEach((element) => {
			element.remove();
		});

		this.$el.querySelectorAll('[data-field-message]').forEach((element) => {
			element.innerHTML = '';
		});
	},

	executeActions(response) {
		response = { actions: {}, ...response };

		for (let action in response.actions) {
			const subject = response.actions[action];
			switch (action) {
				case 'redirect':
					window.location = subject;
					break;
				case 'reset':
					this.$el.reset();
					break;
				case 'reload':
					window.location.reload();
					break;
			}
		}
	},

	showSuccess(response) {
		response = {
			message: [],
			...response,
		};

		if (response.message && response.message.length) {
			const container = this.getMessageContainer();
			container.innerHTML = '';
			container.appendChild(
				callout({
					variant: 'success',
					message: response.message,
				}),
			);
		}

		this.executeActions(response);
	},

	showError(response) {
		const globalMessages = [];
		const errorFields = [];

		for (let field in response.fields) {
			const messages = response.fields[field];

			if (field === '*' || !field) {
				globalMessages.push(messages.join('<br />'));
				continue;
			}

			const input = this.findControl(field);

			if (input.control) {
				input.control.classList.add('is-invalid');
				input.messages.innerHTML = messages.join('<br />');
				errorFields.push(input.control);
			} else {
				globalMessages.push(messages.join('<br />'));
			}
		}

		if (globalMessages.length) {
			const container = this.getMessageContainer();
			container.innerHTML = '';

			const errorCallout = callout({
				variant: 'danger',
				title: 'Error',
				message: globalMessages.join('<br />'),
			});

			container.appendChild(errorCallout);
			errorFields.push(errorCallout);
		}

		if (errorFields.length && this.settings.scroll) {
			const firstRectTop = errorFields[0].getBoundingClientRect().top + window.scrollY;
			const targetY = Math.max(
				0,
				Math.min(
					firstRectTop - window.innerHeight / 2,
					document.documentElement.scrollHeight - window.innerHeight,
				),
			);

			const prefersReduced =
				window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
			const distance = Math.abs(window.scrollY - targetY);

			const addBrrrr = () => {
				if (prefersReduced) return;

				errorFields.forEach((e) => e.classList.add('effect-brrrr'));
				setTimeout(() => {
					errorFields.forEach((e) => e.classList.remove('effect-brrrr'));
				}, 600);
			};

			if (distance < 1 || prefersReduced) {
				addBrrrr();
			} else {
				window.scrollTo({
					top: targetY,
					behavior: 'smooth',
				});
				waitForScrollEnd(targetY).then(addBrrrr);
			}
		}
	},

	findControl(name) {
		const inputControl =
			this.$el.querySelector(`[data-field="${name}"]`) ||
			this.$el.querySelector(`[name="${name}"]:not([type="hidden"])`);
		let messageContainer = null;

		if (inputControl) {
			messageContainer = this.$el.querySelector(`[data-field-message="${name}"]`);

			if (!messageContainer) {
				messageContainer = document.createElement('div');
				messageContainer.className = 'form-hint invalid';
				messageContainer.setAttribute('data-role', 'field.message');
				inputControl.after(messageContainer);
			} else {
				messageContainer.classList.add('form-hint', 'invalid');
			}
		}

		return {
			control: inputControl,
			messages: messageContainer,
		};
	},
});
