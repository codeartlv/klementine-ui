import { Calendar } from 'vanilla-calendar-pro';

export default (initialDate = '', settings = {}) => ({
	hiddenDate: initialDate,
	calendarInstance: null,
	displayFormat: settings.displayFormat || 'd.m.Y',
	min: settings.min || '',
	max: settings.max || '',

	formatForDisplay(isoString) {
		if (!isoString) {
			return '';
		}

		const [year, month, day] = isoString.split('-');

		return this.displayFormat
			.replace('Y', year)
			.replace('y', year.slice(-2))
			.replace('m', month)
			.replace('d', day);
	},

	init() {
		if (this.hiddenDate) {
			this.$refs.waInput.value = this.formatForDisplay(this.hiddenDate);
		}

		const options = {
			type: 'default',
			inputMode: true,
			selectedTheme: 'light',
			selectedDates: this.hiddenDate ? [this.hiddenDate] : [],

			settings: {
				selected: {
					dates: this.hiddenDate ? [this.hiddenDate] : [],
				},
			},

			onClickDate: (self) => {
				if (self.context.selectedDates && self.context.selectedDates.length > 0) {
					const isoDate = self.context.selectedDates[0];

					this.hiddenDate = isoDate;
					this.$refs.waInput.value = this.formatForDisplay(isoDate);
					this.$refs.waInput.dispatchEvent(new Event('wa-change', { bubbles: true }));
					self.hide();
				}
			},
		};

		if (this.min) {
			options.dateMin = this.min;
		}

		if (this.max) {
			options.dateMax = this.max;
		}

		this.calendarInstance = new Calendar(this.$refs.waInput, options);
		this.calendarInstance.init();
	},

	clearDate() {
		this.hiddenDate = '';
		this.$refs.waInput.value = '';

		if (this.calendarInstance) {
			this.calendarInstance.selectedDates = [];

			if (this.calendarInstance.settings?.selected) {
				this.calendarInstance.settings.selected.dates = [];
			}

			this.calendarInstance.update();
		}
	},
});
