import autoComplete from '@tarekraafat/autocomplete.js/dist/autoComplete.js';

export default (source = '', minLength = 1, noResults = '', lookup = false, selected = '') => ({
	engine: null,
	lookup: Boolean(lookup),
	selectedId: selected == null ? '' : String(selected),

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

		if (this.lookup && this.selectedId !== '') {
			input.readOnly = true;
		}

		this.engine = new autoComplete({
			selector: () => input,
			wrapper: false,
			threshold,
			debounce: 200,
			searchEngine: () => ' ',
			data: {
				cache: false,
				keys: ['value'],
				src: async (query) => (await this.fetchSuggestions({ query })) ?? [],
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
					const meta = suggestion && typeof suggestion === 'object'
						? (suggestion.data?.meta ?? suggestion.data?.registrationNumber ?? '')
						: '';

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
						this.apply(event.detail?.selection?.value, true);
					},
					clear: () => {
						if (this.lookup) {
							this.forget();
							return;
						}

						field.value = '';
					},
				},
			},
		});

		if (this.lookup && this.selectedId !== '') {
			await this.loadSelected();
		}
	},

	async fetchSuggestions(params) {
		try {
			const url = new URL(source, window.location.href);

			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.set(key, value == null ? '' : String(value));
			});

			const response = await fetch(url, {
				headers: {
					Accept: 'application/json',
					'X-Requested-With': 'XMLHttpRequest',
				},
				credentials: 'same-origin',
			});

			if (!response.ok) {
				return null;
			}

			const payload = await response.json();

			return Array.isArray(payload?.suggestions) ? payload.suggestions : [];
		} catch {
			return null;
		}
	},

	async loadSelected() {
		const suggestions = await this.fetchSuggestions({ id: this.selectedId });

		if (suggestions === null) {
			return;
		}

		const suggestion = suggestions[0];

		if (!suggestion) {
			this.forget();
			return;
		}

		this.apply(suggestion, false);
	},

	apply(suggestion, announce) {
		if (!suggestion || typeof suggestion !== 'object') {
			return;
		}

		const data = suggestion.data && typeof suggestion.data === 'object' ? suggestion.data : {};
		let next;

		if (this.lookup) {
			const id = data.id != null && String(data.id) !== '' ? String(data.id) : '';

			if (id === '') {
				return;
			}

			this.selectedId = id;

			if (this.$refs.value) {
				this.$refs.value.value = id;
			}

			next = suggestion.value == null ? '' : String(suggestion.value);
		} else {
			const stored = data.registrationNumber ?? data.id;
			next = stored != null && String(stored) !== '' ? String(stored) : String(suggestion.value ?? '');
		}

		const field = this.$refs.field;
		field.value = next;

		const input = field.shadowRoot?.querySelector('input');

		if (input instanceof HTMLInputElement) {
			input.value = next;

			if (this.lookup) {
				input.readOnly = true;
			}
		}

		if (announce) {
			this.$dispatch('autocomplete-select', suggestion);
		}
	},

	clearSelection() {
		this.forget();

		const field = this.$refs.field;
		const input = field?.shadowRoot?.querySelector('input');

		if (input instanceof HTMLInputElement) {
			input.value = '';
			input.focus();
		}
	},

	forget() {
		this.selectedId = '';

		if (this.$refs.value) {
			this.$refs.value.value = '';
		}

		const field = this.$refs.field;

		if (field) {
			field.value = '';
		}

		this.$dispatch('autocomplete-clear');

		const input = field?.shadowRoot?.querySelector('input');

		if (input instanceof HTMLInputElement) {
			input.readOnly = false;
		}
	},

	destroy() {
		this.engine?.unInit?.();
		this.engine = null;
	},
});
