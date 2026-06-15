import spinner from './ui-components/spinner.js';

/**
 * Safely escapes double quotes to prevent HTML breakage.
 */
function escapeHtml(value) {
	return String(value).replace(/"/g, '&quot;');
}

/**
 * Converts a data object into an HTML attribute string.
 * @param {Object} data - The object containing attribute keys and values.
 * @param {Array<string>} blacklist - Keys to exclude from the final string.
 * @returns {string} - The formatted attribute string (e.g., ' color="primary" size="large"').
 */
export function attributes(data = {}, blacklist = []) {
	const blacklistSet = new Set(blacklist);

	const attributes = Object.entries(data)
		.filter(([key, value]) => {
			if (blacklistSet.has(key)) {
				return false;
			}

			if (value === null || value === undefined) {
				return false;
			}

			if (value === false) {
				return false;
			}

			return true;
		})
		.map(([key, value]) => {
			if (value === true) {
				return key;
			}

			return `${key}="${escapeHtml(value)}"`;
		});

	return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
}

export function element(elementString) {
	const template = document.createElement('template');
	template.innerHTML = elementString.trim();

	return template.content.firstChild;
}

export function waitForScrollEnd(targetY, { idleMs = 150, timeoutMs = 2000 } = {}) {
	return new Promise((resolve) => {
		if (Math.abs(window.scrollY - targetY) < 1) {
			return resolve();
		}

		const supportsScrollEnd = 'onscrollend' in window || 'onscrollend' in document;

		if (supportsScrollEnd) {
			const onEnd = () => resolve();

			window.addEventListener('scrollend', onEnd, { once: true });

			setTimeout(() => {
				window.removeEventListener('scrollend', onEnd);
				resolve();
			}, timeoutMs);
			return;
		}

		let lastY = window.scrollY;
		let idle = 0;
		let rafId = null;
		const start = performance.now();

		const tick = (t) => {
			const y = window.scrollY;
			if (Math.abs(y - targetY) < 1) {
				return resolve();
			}
			if (y === lastY) {
				idle += 16;
				if (idle >= idleMs) return resolve();
			} else {
				idle = 0;
				lastY = y;
			}
			if (t - start >= timeoutMs) return resolve();
			rafId = requestAnimationFrame(tick);
		};

		rafId = requestAnimationFrame(tick);
	});
}

export function addSpinner(context, size = 'md', color = 'primary') {
	const wrapper = document.createElement('div');
	wrapper.className = `spinner size-${size} color-${color}`;
	wrapper.setAttribute('role', 'status');
	wrapper.appendChild(spinner());

	context.appendChild(wrapper);
}

export function removeSpinner(context) {
	context.querySelectorAll('.spinner').forEach((el) => el.remove());
}

export class EventEmitter {
	_listeners = new Map();

	on(event, callback) {
		if (!this._listeners.has(event)) {
			this._listeners.set(event, []);
		}
		this._listeners.get(event).push(callback);
		return this;
	}

	trigger(event, ...args) {
		this._listeners.get(event)?.forEach((fn) => fn(...args));
		return this;
	}
}

export function parseJsonLd(element) {
	const jsonText = element.textContent;
	let data = {};

	try {
		data = JSON.parse(jsonText);
	} catch {
		data = {};
	}

	return data;
}

export function randomString(length) {
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

	if (!length) {
		length = Math.floor(Math.random() * chars.length);
	}

	var str = '';
	for (var i = 0; i < length; i++) {
		str += chars[Math.floor(Math.random() * chars.length)];
	}
	return str;
}
