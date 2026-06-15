export default (policyStr) => ({
	password: '',
	type: 'password',
	isRevealed: false,
	hasPolicy: false,
	isLong: false,
	progress: 0,
	progressClass: '',
	policyRules: {},
	state: {},

	init() {
		this.parsePolicy(policyStr);

		Object.keys(this.policyRules).forEach((key) => {
			this.state[key] = false;
		});

		this.$watch('password', () => {
			this.checkPassword();
		});
	},

	parsePolicy(policyStr) {
		if (!policyStr) return;

		const rules = policyStr.split(',');
		this.hasPolicy = rules.length > 0;

		for (let rule of rules) {
			const [ruleName, ruleValue] = rule.split(':');

			switch (ruleName) {
				case 'min':
				case 'max':
					this.policyRules[ruleName] = ruleValue ? Number(ruleValue) : 0;
					break;
				case 'uppercase':
				case 'mixed':
				case 'lowercase':
				case 'number':
				case 'special':
					this.policyRules[ruleName] = true;
					break;
			}
		}
	},

	toggleVisibility() {
		this.isRevealed = !this.isRevealed;
		this.type = this.type === 'text' ? 'password' : 'text';
	},

	checkPassword() {
		const length = Array.from(this.password).length;

		const newState = Object.keys(this.policyRules).reduce(
			(acc, key) => ({ ...acc, [key]: false }),
			{},
		);

		if (this.policyRules.min && length >= this.policyRules.min) newState.min = true;
		if (this.policyRules.max && length >= this.policyRules.max) newState.max = true;

		if (this.policyRules.number) newState.number = /[0-9]/.test(this.password);
		if (this.policyRules.special) newState.special = /(?=.*[^\p{L}\p{N}])/u.test(this.password);
		if (this.policyRules.mixed) newState.mixed = /(?=.*\p{Ll})(?=.*\p{Lu})/u.test(this.password);
		if (this.policyRules.lowercase) newState.lowercase = /\p{Ll}/u.test(this.password);
		if (this.policyRules.uppercase) newState.uppercase = /\p{Lu}/u.test(this.password);

		this.state = newState;
		this.updateProgress();
	},

	updateProgress() {
		let perc = 0;
		let progressState = { ...this.state };

		this.isLong = this.policyRules.max && Array.from(this.password).length >= this.policyRules.max;

		if (progressState.max) {
			perc = 100;
		}

		delete progressState.max;

		let completed = Object.values(progressState).filter(Boolean).length;
		let total = Object.keys(progressState).length;

		if (total > 0) {
			perc = (completed / total) * 100;
		}

		if (this.isLong) {
			perc = 100;
		}

		this.progress = perc;

		if (perc >= 100) {
			this.progressClass = 'success';
		} else if (perc >= 66) {
			this.progressClass = 'warning';
		} else {
			this.progressClass = 'danger';
		}
	},
});
