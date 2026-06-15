import Drawer from '../ui-components/drawer.js';

export default (urlOrElement, caption, id) => ({
	init() {
		this.$el.addEventListener('click', (e) => {
			e.preventDefault();

			const drawer = new Drawer({ id, caption });
			drawer.open(urlOrElement);
		});
	},
});
