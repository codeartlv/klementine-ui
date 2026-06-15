import Dialog from '../ui-components/dialog.js';

export default (urlOrElement, caption, id) => ({
	init() {
		this.$el.addEventListener('click', (e) => {
			e.preventDefault();

			const dialog = new Dialog({ id, caption });
			dialog.open(urlOrElement);
		});
	},
});
