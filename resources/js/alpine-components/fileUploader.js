import { parseJsonLd } from '../helpers.js';
import Uploader from './../lib/uploader.js';

export default () => ({
	uploader: null,

	init() {
		let data = parseJsonLd(this.$el.querySelector('script[data-role="data"]'));
		this.uploader = new Uploader(this.$el, data);
	},
});
