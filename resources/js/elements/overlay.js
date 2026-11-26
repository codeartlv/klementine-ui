/**
 * Dialog and drawer without a native <dialog>. A modal dialog lives in the
 * browser's top layer, which paints above every other element on the page.
 * These overlays stay in normal stacking, so a datepicker popup can sit above
 * them with z-index. The tag names, attributes, slots, parts, and events match
 * the Web Awesome components they replace.
 */

const stack = [];
const scrollLocks = new Set();

const dialogStyles = `
:host {
	--width: 31rem;
	--spacing: var(--wa-space-l);
	--backdrop-filter: none;
	--show-duration: var(--wa-transition-normal);
	--hide-duration: var(--wa-transition-normal);
	display: none;
}

:host([open]) {
	display: grid;
	position: fixed;
	inset: 0;
	z-index: 700;
	place-items: center;
}

:host([contained][open]) {
	position: absolute;
}

.backdrop {
	position: absolute;
	inset: 0;
	background-color: var(--wa-color-overlay-modal, rgb(0 0 0 / 0.25));
	backdrop-filter: var(--backdrop-filter);
}

.panel {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: var(--width);
	max-width: calc(100% - var(--wa-space-2xl));
	max-height: calc(100% - var(--wa-space-2xl));
	min-width: 0;
	min-height: 0;
	margin: 0;
	padding: 0;
	overflow: hidden;
	color: inherit;
	background-color: var(--wa-color-surface-raised);
	border: none;
	border-radius: var(--wa-panel-border-radius);
	box-shadow: var(--wa-shadow-l);
}

.panel:focus {
	outline: none;
}

.panel.show {
	animation: overlay-show-dialog var(--show-duration) ease;
}

.panel.hide {
	animation: overlay-show-dialog var(--hide-duration) ease reverse;
}

.panel.pulse {
	animation: overlay-pulse 250ms ease;
}

.backdrop.show {
	animation: overlay-show-backdrop var(--show-duration, 200ms) ease;
}

.backdrop.hide {
	animation: overlay-show-backdrop var(--hide-duration, 200ms) ease reverse;
}

@media screen and (max-width: 420px) {
	.panel {
		max-height: 80vh;
	}
}

@keyframes overlay-show-dialog {
	from { opacity: 0; scale: 0.8; }
	to { opacity: 1; scale: 1; }
}

@keyframes overlay-pulse {
	0% { scale: 1; }
	50% { scale: 1.02; }
	100% { scale: 1; }
}
`;

const drawerStyles = `
:host {
	--size: 25rem;
	--spacing: var(--wa-space-l);
	--backdrop-filter: none;
	--show-duration: var(--wa-transition-normal);
	--hide-duration: var(--wa-transition-normal);
	display: none;
}

:host([open]) {
	display: block;
	position: fixed;
	inset: 0;
	z-index: 700;
}

:host([contained][open]) {
	position: absolute;
}

.backdrop {
	position: absolute;
	inset: 0;
	background-color: var(--wa-color-overlay-modal, rgb(0 0 0 / 0.25));
	backdrop-filter: var(--backdrop-filter);
}

.panel {
	position: absolute;
	display: flex;
	flex-direction: column;
	max-width: 100%;
	max-height: 100%;
	min-width: 0;
	min-height: 0;
	margin: 0;
	padding: 0;
	overflow: hidden;
	color: inherit;
	background-color: var(--wa-color-surface-raised);
	border: none;
	box-shadow: var(--wa-shadow-l);
}

.panel:focus {
	outline: none;
}

.panel.top {
	top: 0;
	inset-inline: 0;
	height: var(--size);
}

.panel.end {
	top: 0;
	bottom: 0;
	inset-inline-end: 0;
	width: var(--size);
}

.panel.bottom {
	bottom: 0;
	inset-inline: 0;
	height: var(--size);
}

.panel.start {
	top: 0;
	bottom: 0;
	inset-inline-start: 0;
	width: var(--size);
}

.panel.show.top { animation: overlay-drawer-top var(--show-duration) ease; }
.panel.hide.top { animation: overlay-drawer-top var(--hide-duration) ease reverse; }
.panel.show.end { animation: overlay-drawer-end var(--show-duration) ease; }
.panel.hide.end { animation: overlay-drawer-end var(--hide-duration) ease reverse; }
.panel.show.bottom { animation: overlay-drawer-bottom var(--show-duration) ease; }
.panel.hide.bottom { animation: overlay-drawer-bottom var(--hide-duration) ease reverse; }
.panel.show.start { animation: overlay-drawer-start var(--show-duration) ease; }
.panel.hide.start { animation: overlay-drawer-start var(--hide-duration) ease reverse; }
.panel.pulse { animation: overlay-pulse 250ms ease; }

.backdrop.show { animation: overlay-show-backdrop var(--show-duration, 200ms) ease; }
.backdrop.hide { animation: overlay-show-backdrop var(--hide-duration, 200ms) ease reverse; }

@keyframes overlay-drawer-top {
	from { opacity: 0; translate: 0 -100%; }
	to { opacity: 1; translate: 0 0; }
}

@keyframes overlay-drawer-end {
	from { opacity: 0; translate: 100%; }
	to { opacity: 1; translate: 0 0; }
}

@keyframes overlay-drawer-bottom {
	from { opacity: 0; translate: 0 100%; }
	to { opacity: 1; translate: 0 0; }
}

@keyframes overlay-drawer-start {
	from { opacity: 0; translate: -100% 0; }
	to { opacity: 1; translate: 0 0; }
}

@keyframes overlay-pulse {
	0% { scale: 1; }
	50% { scale: 1.01; }
	100% { scale: 1; }
}
`;

const sharedStyles = `
:host, *, *::before, *::after {
	box-sizing: border-box;
}

.header {
	display: flex;
	flex-wrap: nowrap;
	padding-inline-start: var(--spacing);
	padding-block-end: 0;
	padding-inline-end: calc(var(--spacing) - var(--wa-form-control-padding-block));
	padding-block-start: calc(var(--spacing) - var(--wa-form-control-padding-block));
}

.title {
	align-self: center;
	flex: 1 1 auto;
	margin: 0;
	font-family: inherit;
	font-size: var(--wa-font-size-l);
	font-weight: var(--wa-font-weight-heading);
	line-height: var(--wa-line-height-condensed);
}

.header-actions {
	align-self: start;
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	justify-content: end;
	gap: var(--wa-space-2xs);
	padding-inline-start: var(--spacing);
}

.body {
	flex: 1 1 auto;
	display: block;
	min-width: 0;
	min-height: 0;
	padding: var(--spacing);
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

.body:focus {
	outline: none;
}

.body ::slotted(*) {
	max-width: 100%;
	min-width: 0;
}

.footer {
	display: block;
	padding: var(--spacing);
	padding-block-start: 0;
}

.footer[hidden] {
	display: none;
}

@keyframes overlay-show-backdrop {
	from { opacity: 0; }
	to { opacity: 1; }
}

@media (forced-colors: active) {
	.panel {
		border: solid 1px white;
	}
}
`;

const FOCUSABLE = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'wa-button:not([disabled])',
	'wa-input:not([disabled])',
	'wa-select:not([disabled])',
	'wa-textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

function lockBodyScrolling(lockingEl) {
	scrollLocks.add(lockingEl);

	if (document.documentElement.classList.contains('wa-scroll-lock')) {
		return;
	}

	const scrollbarWidth = Math.abs(window.innerWidth - document.documentElement.clientWidth);
	const padding = Number(getComputedStyle(document.body).paddingRight.replace(/px/, '')) || 0;
	const width = scrollbarWidth + padding;
	let gutter = getComputedStyle(document.documentElement).scrollbarGutter;

	if (!gutter || gutter === 'auto') {
		gutter = 'stable';
	}

	if (width < 2) {
		gutter = '';
	}

	document.documentElement.style.setProperty('--wa-scroll-lock-gutter', gutter);
	document.documentElement.style.setProperty('--wa-scroll-lock-size', `${width}px`);
	document.documentElement.classList.add('wa-scroll-lock');
}

function unlockBodyScrolling(lockingEl) {
	scrollLocks.delete(lockingEl);

	if (scrollLocks.size > 0) {
		return;
	}

	document.documentElement.classList.remove('wa-scroll-lock');
	document.documentElement.style.removeProperty('--wa-scroll-lock-size');
	document.documentElement.style.removeProperty('--wa-scroll-lock-gutter');
}

function animationDuration(element) {
	const duration = getComputedStyle(element).animationDuration || '';
	const first = duration.split(',')[0].trim();

	if (first.endsWith('ms')) {
		return parseFloat(first);
	}

	if (first.endsWith('s')) {
		return parseFloat(first) * 1000;
	}

	return 0;
}

function play(element, className) {
	return new Promise((resolve) => {
		let settled = false;
		const finish = () => {
			if (settled) {
				return;
			}

			settled = true;
			element.removeEventListener('animationend', onEnd);
			resolve();
		};
		const onEnd = (event) => {
			if (event.target === element) {
				finish();
			}
		};

		element.addEventListener('animationend', onEnd);
		element.classList.add(className);

		const duration = animationDuration(element);

		if (!duration) {
			finish();
			return;
		}

		window.setTimeout(finish, duration + 50);
	});
}

class OverlayElement extends HTMLElement {
	static get observedAttributes() {
		return ['open', 'label', 'light-dismiss', 'without-header', 'with-footer', 'with-label', 'placement'];
	}

	constructor() {
		super();
		this._open = false;
		this._shown = false;
		this._closing = false;
		this._ready = false;
		this._generation = 0;
		this._trigger = null;
		this._onKeyDown = (event) => this.onKeyDown(event);
		this._onClick = (event) => this.onClick(event);
	}

	connectedCallback() {
		if (!this._ready) {
			this.render();
			this._ready = true;
		}

		if (this._open || this.hasAttribute('open')) {
			this._open = false;
			this.open = true;
		}
	}

	disconnectedCallback() {
		if (!this._shown && !this._closing) {
			return;
		}

		this._shown = false;
		this._closing = false;
		this._generation += 1;
		this.removeListeners();
		unlockBodyScrolling(this);
		const index = stack.indexOf(this);

		if (index !== -1) {
			stack.splice(index, 1);
		}
	}

	attributeChangedCallback(name) {
		if (!this._ready && name !== 'open') {
			return;
		}

		if (name === 'open') {
			this.open = this.hasAttribute('open');
			return;
		}

		if (name === 'placement') {
			this.syncPlacement();
			return;
		}

		this.syncChrome();
	}

	get open() {
		return this._open;
	}

	set open(value) {
		const next = Boolean(value);

		if (next === this._open) {
			return;
		}

		if (!next && (this._shown || this._closing)) {
			this.requestClose(this);
			return;
		}

		this._open = next;
		this.reflectOpen();

		if (this._ready && next) {
			this.show();
		}
	}

	render() {
		const root = this.attachShadow({ mode: 'open' });
		const style = document.createElement('style');
		style.textContent = `${this.kind === 'drawer' ? drawerStyles : dialogStyles}\n${sharedStyles}`;

		const backdrop = document.createElement('div');
		backdrop.className = 'backdrop';
		backdrop.part = 'backdrop';
		backdrop.addEventListener('pointerdown', () => this.onBackdrop());

		const panel = document.createElement('div');
		panel.className = 'panel';
		panel.part = 'dialog';
		panel.tabIndex = -1;
		panel.setAttribute('role', 'dialog');
		panel.setAttribute('aria-modal', 'true');
		panel.setAttribute('aria-labelledby', 'title');

		panel.innerHTML = `
			<div part="header" class="header">
				<h2 part="title" class="title" id="title">
					<slot name="label"><span class="label-text"></span></slot>
				</h2>
				<div part="header-actions" class="header-actions">
					<slot name="header-actions"></slot>
					<wa-button part="close-button" exportparts="base:close-button__base" class="close" appearance="plain" type="button">
						<wa-icon name="xmark" library="system" label="Close"></wa-icon>
					</wa-button>
				</div>
			</div>
			<div part="body" class="body"><slot></slot></div>
			<div part="footer" class="footer" hidden><slot name="footer"></slot></div>
		`;

		root.append(style, backdrop, panel);
		this._root = root;
		this._backdrop = backdrop;
		this._panel = panel;
		this._header = panel.querySelector('.header');
		this._label = panel.querySelector('.label-text');
		this._footer = panel.querySelector('.footer');

		panel.querySelector('.close').addEventListener('click', (event) => {
			event.stopPropagation();
			this.requestClose(event.currentTarget);
		});
		panel.querySelector('slot[name="footer"]').addEventListener('slotchange', () => this.syncChrome());
		panel.querySelector('slot[name="label"]').addEventListener('slotchange', () => this.syncChrome());
		this.syncPlacement();
		this.syncChrome();
	}

	reflectOpen() {
		if (this._open) {
			this.setAttribute('open', '');
		} else {
			this.removeAttribute('open');
		}
	}

	syncPlacement() {
		if (this.kind !== 'drawer' || !this._panel) {
			return;
		}

		const placement = this.getAttribute('placement') || 'end';

		for (const name of ['top', 'end', 'bottom', 'start']) {
			this._panel.classList.toggle(name, name === placement);
		}
	}

	syncChrome() {
		if (!this._header) {
			return;
		}

		this._header.hidden = this.hasAttribute('without-header');
		const label = this.getAttribute('label') || '';
		this._label.textContent = label.length > 0 ? label : '\u200B';

		const footerSlot = this._footer.querySelector('slot');
		const hasFooter = this.hasAttribute('with-footer') || footerSlot.assignedElements().length > 0;
		this._footer.hidden = !hasFooter;

		if (this._header.hidden && label.length > 0) {
			this._panel.setAttribute('aria-label', label);
			this._panel.removeAttribute('aria-labelledby');
		} else {
			this._panel.setAttribute('aria-labelledby', 'title');
			this._panel.removeAttribute('aria-label');
		}
	}

	show() {
		if (this._shown || this._closing) {
			return;
		}

		const showEvent = new Event('wa-show', { bubbles: true, cancelable: true, composed: true });
		this.dispatchEvent(showEvent);

		if (showEvent.defaultPrevented) {
			this._open = false;
			this.reflectOpen();
			return;
		}

		this._shown = true;
		this._open = true;
		this.reflectOpen();
		this._trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		stack.push(this);
		this.style.zIndex = String(700 + stack.length * 2);
		lockBodyScrolling(this);
		this.addListeners();
		const generation = ++this._generation;
		window.requestAnimationFrame(() => {
			if (generation === this._generation) {
				this.focusInitial();
			}
		});

		Promise.all([play(this._panel, 'show'), play(this._backdrop, 'show')]).then(() => {
			this._panel.classList.remove('show');
			this._backdrop.classList.remove('show');

			if (generation === this._generation && this._shown && !this._closing) {
				this.dispatchEvent(new Event('wa-after-show', { bubbles: true, composed: true }));
			}
		});
	}

	requestClose(source) {
		if (this._closing || !this._shown) {
			return;
		}

		const hideEvent = new Event('wa-hide', { bubbles: true, cancelable: true, composed: true });
		hideEvent.detail = { source };
		this.dispatchEvent(hideEvent);

		if (hideEvent.defaultPrevented) {
			this._open = true;
			this.reflectOpen();
			this.pulse();
			return;
		}

		this._closing = true;
		this.removeListeners();
		const index = stack.indexOf(this);

		if (index !== -1) {
			stack.splice(index, 1);
		}

		const generation = this._generation;

		Promise.all([play(this._panel, 'hide'), play(this._backdrop, 'hide')]).then(() => {
			if (generation !== this._generation) {
				return;
			}

			this._shown = false;
			this._closing = false;
			this._open = false;
			this.reflectOpen();
			this._panel.classList.remove('hide');
			this._backdrop.classList.remove('hide');
			unlockBodyScrolling(this);

			if (this._trigger && typeof this._trigger.focus === 'function') {
				window.setTimeout(() => this._trigger.focus());
			}

			this.dispatchEvent(new Event('wa-after-hide', { bubbles: true, composed: true }));
		});
	}

	pulse() {
		this._panel.classList.remove('pulse');
		void this._panel.offsetWidth;
		this._panel.classList.add('pulse');
		window.setTimeout(() => this._panel.classList.remove('pulse'), 250);
	}

	addListeners() {
		document.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('click', this._onClick);
	}

	removeListeners() {
		document.removeEventListener('keydown', this._onKeyDown);
		this.removeEventListener('click', this._onClick);
	}

	onBackdrop() {
		if (!this._shown || this._closing) {
			return;
		}

		if (this.hasAttribute('light-dismiss')) {
			this.requestClose(this);
			return;
		}

		this.pulse();
	}

	onClick(event) {
		const control = event.composedPath().find((node) => {
			return node instanceof Element && node.getAttribute('data-dialog') === 'close';
		});

		if (!control) {
			return;
		}

		event.preventDefault();
		this.requestClose(control);
	}

	onKeyDown(event) {
		if (stack[stack.length - 1] !== this || !this._shown) {
			return;
		}

		if (event.key === 'Escape') {
			const inCalendar = event.composedPath().some((node) => {
				return node instanceof Element && node.matches('[data-vc="calendar"]');
			});

			if (inCalendar) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			this.requestClose(this);
			return;
		}

		if (event.key !== 'Tab') {
			return;
		}

		const active = this._root.activeElement || document.activeElement;
		const inside = active === this || this.contains(active) || this._root.contains(active);

		if (!inside) {
			return;
		}

		const items = this.focusable();

		if (items.length === 0) {
			event.preventDefault();
			this._panel.focus();
			return;
		}

		const first = items[0];
		const last = items[items.length - 1];

		if (event.shiftKey && (active === first || active === this._panel)) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && (active === last || active === this)) {
			event.preventDefault();
			first.focus();
		}
	}

	focusInitial() {
		const target = this.querySelector('[autofocus]');

		if (target instanceof HTMLElement) {
			target.focus();
			return;
		}

		this._panel.focus();
	}

	focusable() {
		const close = this._root.querySelector('wa-button.close');
		const light = [...this.querySelectorAll(FOCUSABLE)];
		const items = [];

		if (close && !this._header.hidden) {
			items.push(close);
		}

		for (const item of light) {
			if (!items.includes(item)) {
				items.push(item);
			}
		}

		return items;
	}
}

class DialogElement extends OverlayElement {
	constructor() {
		super();
		this.kind = 'dialog';
	}
}

class DrawerElement extends OverlayElement {
	constructor() {
		super();
		this.kind = 'drawer';
	}
}

if (!customElements.get('wa-dialog')) {
	customElements.define('wa-dialog', DialogElement);
}

if (!customElements.get('wa-drawer')) {
	customElements.define('wa-drawer', DrawerElement);
}

document.addEventListener('click', (event) => {
	const source = event.composedPath().find((node) => {
		return node instanceof Element && node.hasAttribute('data-dialog');
	});

	if (!(source instanceof Element)) {
		return;
	}

	const [command, id] = source.getAttribute('data-dialog').split(/\s+/);

	if (command !== 'open' || !id) {
		return;
	}

	const dialog = source.getRootNode().getElementById?.(id) || document.getElementById(id);

	if (dialog instanceof DialogElement) {
		dialog.open = true;
	}
});
