import autoComplete from '@tarekraafat/autocomplete.js/dist/autoComplete.js';

export default (source = '', minLength = 1, noResults = '') => ({
	engine: null,

	async init() {
		const field = this.$refs.field;
		const results = this.$refs.results;

		if (!source || !field || !results) {
			return;
		}

		await customElements.whenDefined('wa-input');

		if (field.updateComplete) {
			await field.updateComplete;
		}

		const input = field.shadowRoot?.querySelector('input');

		if (!(input instanceof HTMLInputElement)) {
			return;
		}

		const threshold = Number(minLength) > 0 ? Number(minLength) : 1;

		this.engine = new autoComplete({
			selector: () => input,
			wrapper: false,
			threshold,
			debounce: 200,
			searchEngine: () => ' ',
			data: {
				cache: false,
				keys: ['value'],
				src: async (query) => {
					try {
						const url = new URL(source, window.location.href);
						url.searchParams.set('query', query);

						const response = await fetch(url, {
							headers: {
								Accept: 'application/json',
								'X-Requested-With': 'XMLHttpRequest',
							},
							credentials: 'same-origin',
						});

						if (!response.ok) {
							return [];
						}

						const payload = await response.json();

						return Array.isArray(payload?.suggestions) ? payload.suggestions : [];
					} catch {
						return [];
					}
				},
			},
			resultsList: {
				destination: () => results,
				position: 'beforeend',
				class: 'autocomplete__list',
				maxResults: 15,
				noResults: true,
				element: (list, data) => {
					if (data.results.length > 0 || !noResults) {
						return;
					}

					const note = document.createElement('div');
					note.className = 'autocomplete__empty';
					note.textContent = noResults;
					list.append(note);
				},
			},
			resultItem: {
				class: 'autocomplete__item',
				element: (item, data) => {
					const suggestion = data?.value;
					const label = suggestion && typeof suggestion === 'object' ? suggestion.value : suggestion;
					const meta = suggestion && typeof suggestion === 'object' ? suggestion.data?.registrationNumber : '';

					item.replaceChildren();

					const title = document.createElement('span');
					title.className = 'autocomplete__label';
					title.textContent = label == null ? '' : String(label);
					item.append(title);

					if (meta != null && String(meta) !== '' && String(meta) !== title.textContent) {
						const detail = document.createElement('span');
						detail.className = 'autocomplete__meta';
						detail.textContent = String(meta);
						item.append(detail);
					}
				},
			},
			events: {
				input: {
					selection: (event) => {
						this.choose(event.detail?.selection?.value);
					},
					clear: () => {
						field.value = '';
					},
				},
			},
		});
	},

	choose(suggestion) {
		if (!suggestion || typeof suggestion !== 'object') {
			return;
		}

		const data = suggestion.data && typeof suggestion.data === 'object' ? suggestion.data : {};
		const stored = data.registrationNumber ?? data.id;
		const next = stored != null && String(stored) !== '' ? String(stored) : String(suggestion.value ?? '');
		const field = this.$refs.field;

		field.value = next;

		const input = field.shadowRoot?.querySelector('input');

		if (input instanceof HTMLInputElement) {
			input.value = next;
		}

		this.$dispatch('autocomplete-select', suggestion);
	},

	destroy() {
		this.engine?.unInit?.();
		this.engine = null;
	},
});
