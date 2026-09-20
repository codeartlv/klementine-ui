/**
 * Alpine's x-model treats an element as a checkbox/radio only when `el.type`
 * is "checkbox" or "radio". Web Awesome hosts do not expose that property, so
 * Alpine listens for `input` and writes `.value` instead of `change` / `.checked`.
 */
const WEB_AWESOME_CONTROL_TYPES = {
	'wa-checkbox': 'checkbox',
	'wa-switch': 'checkbox',
	'wa-radio': 'radio',
};

export function patchWebAwesomeForAlpine() {
	for (const [tag, type] of Object.entries(WEB_AWESOME_CONTROL_TYPES)) {
		const ctor = customElements.get(tag);

		if (!ctor || Object.getOwnPropertyDescriptor(ctor.prototype, 'type')) {
			continue;
		}

		Object.defineProperty(ctor.prototype, 'type', {
			configurable: true,
			get() {
				return type;
			},
		});
	}
}
