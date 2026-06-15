import { addSpinner, removeSpinner, randomString } from '../helpers.js';
import Sortable from 'sortablejs';

class ManagedFile {
	constructor({
		id = null,
		type = null,
		caption = '',
		thumbnail = null,
		image = null,
		filename = null,
		extension = null,
		message = null,
		locked = false,
		error = false,
		status = 'pending',
		nativeFile = null,
		properties = null,
	} = {}) {
		this.id = id;
		this.type = type;
		this.caption = caption;
		this.thumbnail = thumbnail;
		this.image = image;
		this.filename = filename;
		this.extension = extension;
		this.message = message;
		this.locked = !!locked;
		this.error = !!error;
		this.status = status;
		this.nativeFile = nativeFile;
		this.properties = { ...(properties || {}) };

		this.thumbnailEl = null;

		this.options = new Map();

		this._uid = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
	}

	setProperty(key, value) {
		this.properties[key] = value;
	}

	getProperty(key) {
		return this.properties[key] ?? null;
	}

	isImage() {
		if (this.type) {
			return this.type === 'photo';
		}

		if (this.nativeFile && typeof this.nativeFile.type === 'string') {
			return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(this.nativeFile.type);
		}
		if (this.extension) {
			return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
				this.extension.toLowerCase(),
			);
		}
		return false;
	}
}

export default class Uploader {
	events = {
		queueChange: [],
		beforeFileSelect: [],
	};

	constructor(element, params) {
		this.element = element;
		this.params = {
			uploadroute: '',
			deleteroute: '',
			submitbtn: '',
			limit: 1,
			list: null,
			files: [],
			name: '',
			maxsize: 1024,
			sortable: false,
			captions: false,
			trigger: null,

			fileOptions: {
				remove: {
					caption: '',
					icon: 'close',
					available: (file) => true,
					callback: (file, thumbnailEl, uploader) => {
						uploader.deleteFile(file, thumbnailEl);
					},
				},
			},

			...params,
		};

		this.eventListeners = new Map();

		this.fileSelector = this.element.querySelector('input[type="file"]');
		this.submitButton = this.params.submitbtn
			? document.querySelector(this.params.submitbtn)
			: null;

		if (!this.fileSelector) {
			console.error('File input not found.');
			return;
		}

		// Respect limit
		if (Number(this.params.limit) > 1) {
			this.fileSelector.multiple = true;
		}

		if (this.params.captions) {
			element.classList.add('has-captions');
		}

		this.list = this.params.list
			? document.querySelector(this.params.list)
			: this.element.querySelector('[data-role="list"]');

		this.triggerEl = element.querySelector('[data-role="trigger"]');

		this.fieldName = this.fileSelector.name;
		this.fileSelector.setAttribute('name', '');

		this.files = [];

		if (this.params.sortable) {
			new Sortable(this.list, {
				animation: 150,
				delay: 500,
				delayOnTouchOnly: true,
				preventOnFilter: false,
				draggable: '.upload-file',
				onEnd: () => {
					this._reconcileOrderFromDOM();
					this.syncIds();
					this.trigger('queueChange', this.files.slice());
				},
			});
		}

		this._initUploader();

		const preload = this.params.files;

		if (Array.isArray(preload) && preload.length) {
			this.setImages(preload);
			this.syncIds();
		}

		if (this.params.trigger) {
			const triggerEl = document.querySelector(this.params.trigger);
			element.classList.add('has-external-trigger');

			if (triggerEl) {
				let inputIds = 'trigger_' + randomString(20);

				triggerEl.setAttribute('for', inputIds);
				triggerEl.setAttribute('id', '');
				this.fileSelector.setAttribute('id', inputIds);
			}
		}
	}

	/*** Event system ***/
	on(event, callback) {
		if (!this.eventListeners.has(event)) this.eventListeners.set(event, []);
		this.eventListeners.get(event).push(callback);
	}

	trigger(event, ...args) {
		const listeners = this.eventListeners.get(event);

		if (listeners && listeners.length) {
			listeners.forEach((fn) => fn(...args));
		}
	}

	/*** Public API ***/

	/**
	 * Add a per-file option at runtime. The option object must match global options:
	 * { caption, icon, callback(file, thumbnailEl, uploader), available(file) }
	 *
	 * @param {ManagedFile|number|HTMLElement} target ManagedFile instance, file id, or thumbnail element
	 * @param {string} key unique key e.g. 'rotate'
	 * @param {object} option option object as above
	 */
	addOption(target, key, option) {
		let addOptionToFile = (file, key, option) => {
			file.options.set(key, this._normalizeOption(option));

			if (file.thumbnailEl) {
				this._renderOptionsInto(file, file.thumbnailEl);
			}
		};

		if (target) {
			const file = this._resolveFile(target);

			if (!file) {
				return;
			}

			addOptionToFile(file, key, option);
			return;
		}

		for (let i = 0; i < this.files.length; i++) {
			addOptionToFile(this.files[i], key, option);
		}

		this.params.fileOptions[key] = option;
	}

	/**
	 * Programmatically clear all files
	 */
	clear() {
		this.clearIds();
		this.files.forEach((f) => {
			if (f.thumbnailEl) f.thumbnailEl.remove();
		});

		this.files = [];
		this._checkLimits();

		this.trigger('queueChange', this.files.slice());
	}

	/**
	 * Load pre-existing files
	 */
	setImages(preloaded) {
		this.clear();

		preloaded.forEach((entry) => {
			const fData = entry && entry.file ? entry.file : entry;
			if (!fData) {
				return;
			}

			const mf = new ManagedFile({
				id: fData.id ?? null,
				type: fData.type ?? null,
				caption: fData.caption ?? '',
				thumbnail: fData.thumbnail ?? null,
				image: fData.image ?? null,
				filename: fData.filename ?? null,
				extension: fData.extension ?? null,
				properties: fData.properties ?? null,
				message: null,
				locked: !!fData.locked,
				error: false,
				status: 'completed',
			});

			const thumb = this._createThumbnail();
			this._applyStateClasses(thumb, { ready: true, error: false });

			this._paintThumbnail(thumb, mf);
			this._appendThumbnailToList(thumb, true);
			this._bindThumbnailEvents(thumb, mf);
			mf.thumbnailEl = thumb;

			this.files.push(mf);
		});

		this._checkLimits();
		this.trigger('queueChange', this.files.slice());
	}

	/**
	 * Returns how many more files can be added (-1 means unlimited).
	 */
	getAllowedFileCount() {
		const limit = Number(this.params.limit);

		if (limit <= 0) {
			return -1;
		}

		return Math.max(0, limit - this.files.length);
	}

	getFile(id) {
		for (let i = 0; i < this.files.length; i++) {
			if (this.files[i].id == id) {
				return this.files[i];
			}
		}

		return null;
	}

	_initUploader() {
		// Change via dialog
		this.fileSelector.addEventListener('change', () => {
			const files = Array.from(this.fileSelector.files || []);
			this._onFileSelect(files);
			this.fileSelector.value = '';
		});

		// Drag & drop
		const handleDrag = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.type === 'dragenter') {
				this.element.classList.add('file-drag');
			}
		};

		const handleDragLeave = (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.element.classList.remove('file-drag');
		};

		const handleDrop = (e) => {
			e.preventDefault();
			e.stopPropagation();
			const dataTransfer = e.dataTransfer || e.originalEvent?.dataTransfer;
			const files = Array.from(dataTransfer?.files || []);

			if (!files.length) {
				return;
			}

			for (let i = 0; i < files.length; i++) {
				const allowed = this.getAllowedFileCount();
				if (allowed === 0) break;
				this._startUpload(files[i]);
			}
		};

		this.element.addEventListener('dragenter', handleDrag);
		this.element.addEventListener('dragover', handleDrag);
		this.element.addEventListener('dragleave', handleDragLeave);
		this.element.addEventListener('drop', handleDrop);

		this._checkLimits();
		this.syncIds();
	}

	_onFileSelect(nativeFiles) {
		for (let i = 0; i < nativeFiles.length; i++) {
			const allowed = this.getAllowedFileCount();
			if (allowed === 0) break;
			this._startUpload(nativeFiles[i]);
		}
	}

	_spinnerContainer(thumb) {
		return thumb.querySelector('[data-role="spinner-container"]') || thumb;
	}

	/*** Upload Flow ***/
	_startUpload(nativeFile) {
		// Create model immediately (pending), render skeleton thumbnail
		const mf = new ManagedFile({
			nativeFile,
			filename: nativeFile.name ?? null,
			extension:
				nativeFile.name && nativeFile.name.includes('.') ? nativeFile.name.split('.').pop() : null,
			status: 'pending',
			error: false,
		});

		const thumb = this._createThumbnail();
		mf.thumbnailEl = thumb;

		// Quick local preview for images
		if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(nativeFile.type)) {
			const reader = new FileReader();
			reader.onload = (e) => {
				mf.thumbnail = e.target.result;
				this._paintThumbnail(thumb, mf);
			};

			reader.readAsDataURL(nativeFile);
		} else {
			this._paintThumbnail(thumb, mf);
		}

		addSpinner(this._spinnerContainer(thumb));
		this._appendThumbnailToList(thumb);
		this._bindThumbnailEvents(thumb, mf);
		this.files.push(mf);

		this._checkLimits();
		this._toggleSubmitDisabled(true);
		this.trigger('queueChange', this.files.slice());

		// Build and send XHR
		const url = this.params.uploadroute;

		const xhr = new XMLHttpRequest();
		xhr.open('POST', url);

		const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
		if (csrfToken) xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);

		const progressEl = thumb.querySelector('[data-role="progress"]');

		if (progressEl) {
			xhr.upload.addEventListener('progress', (e) => {
				if (!e.lengthComputable || !progressEl) return;
				const percent = (e.loaded / e.total) * 100;
				progressEl.style.width = percent + '%';
			});
		}

		xhr.addEventListener('load', () => {
			if (progressEl) {
				progressEl.style.width = '100%';
			}

			removeSpinner(this._spinnerContainer(thumb));

			let response = null;

			try {
				response = JSON.parse(xhr.responseText);
			} catch (e) {
				response = {
					error: true,
					message: xhr.statusText || this.params.messages?.uploadError || 'Upload error',
					file: null,
				};
			}

			if (
				xhr.status >= 200 &&
				xhr.status < 300 &&
				response &&
				response.error === false &&
				response.file
			) {
				// Success path
				const f = response.file;
				mf.id = f.id ?? null;
				mf.type = f.type ?? mf.type;
				mf.caption = f.caption ?? mf.caption;
				mf.thumbnail = typeof f.thumbnail === 'string' && f.thumbnail ? f.thumbnail : mf.thumbnail;
				mf.image = f.image ?? mf.image;
				mf.filename = f.filename ?? mf.filename;
				mf.extension = f.extension ?? mf.extension;
				mf.message = response.message ?? null;
				mf.locked = !!f.locked;
				mf.error = false;
				mf.status = 'ready';

				this._applyStateClasses(thumb, { ready: true, error: false });

				this._paintThumbnail(thumb, mf);
				this._renderOptionsInto(mf, thumb);

				this._toggleSubmitDisabled(false);
				this.syncIds();
				this.trigger('queueChange', this.files.slice());

				return;
			}

			mf.message = (response && response.message) || xhr.statusText || this.params.messages?.uploadError || 'Upload error';
			mf.error = true;
			mf.status = 'error';

			if (xhr.status == 413) {
				mf.message = this.params.messages?.uploadMaxFilesize || mf.message;
			}

			this._applyStateClasses(thumb, { ready: false, error: true });

			const msg = thumb.querySelector('[data-role="message"]');

			if (msg) {
				msg.innerText = mf.message;
			}

			this._paintThumbnail(thumb, mf);
			this._renderOptionsInto(mf, thumb);

			this._toggleSubmitDisabled(false);
			this.syncIds();
			this.trigger('queueChange', this.files.slice());
		});

		xhr.addEventListener('error', (e) => {
			removeSpinner(this._spinnerContainer(thumb));

			mf.message = this.params.messages?.uploadError || 'Upload error';
			mf.error = true;
			mf.status = 'error';

			this._applyStateClasses(thumb, { ready: false, error: true });
			const msg = thumb.querySelector('[data-role="message"]');

			if (msg) {
				msg.innerText = mf.message;
			}

			this._renderOptionsInto(mf, thumb);
			this._toggleSubmitDisabled(false);
			this.syncIds();
			this.trigger('queueChange', this.files.slice());
		});

		xhr.addEventListener('abort', () => {
			removeSpinner(this._spinnerContainer(thumb));
			this.deleteFile(mf, thumb, { silent: true });
		});

		const form = new FormData();
		form.append('file', nativeFile);
		xhr.send(form);
	}

	/*** DOM helpers (thumbnail/UI paint) ***/
	_createThumbnail() {
		const template = this.element.querySelector('template[data-role="thumbnail"]');
		const thumbnail = template.content.cloneNode(true);
		const el = thumbnail.querySelector(':first-child');

		el.classList.add('upload-file');

		el.setAttribute('data-uid', '');

		return el;
	}

	_appendThumbnailToList(thumbnail, append = false) {
		if (append) {
			this.list.appendChild(thumbnail);
		} else {
			this.list.insertBefore(thumbnail, this.list.firstChild);
		}
	}

	_bindThumbnailEvents(thumbnailEl, file) {
		const menu = thumbnailEl.querySelector('[data-role="menu"]');

		if (menu) {
			menu.parentElement.addEventListener('show.bs.dropdown', () => {
				this._renderOptionsInto(file, thumbnailEl);
			});
		}

		this._renderOptionsInto(file, thumbnailEl);
	}

	_paintThumbnail(thumbnailEl, file) {
		if (file.id != null) {
			thumbnailEl.dataset.id = String(file.id);
		}

		thumbnailEl.setAttribute('data-uid', file._uid);

		const filenameEl = thumbnailEl.querySelector('[data-role="filename"]');
		const iconEl = thumbnailEl.querySelector('[data-role="file-icon"]');
		const msgEl = thumbnailEl.querySelector('[data-role="message"]');
		const thumbBg = thumbnailEl.querySelector('[data-role="thumbnail"]');
		const captionEl = thumbnailEl.querySelector('[data-role="caption"]');

		if (file.id != null && captionEl) {
			captionEl.name = this.fieldName + `[${file.id}][caption]`;
			captionEl.value = file?.caption;
		}

		if (filenameEl) {
			filenameEl.innerText = file.filename || (file.image ? file.image.split('/').pop() : '') || '';
		}

		if (iconEl) {
			iconEl.className = iconEl.className.replace(/\bfiv-icon-\S+/g, '').trim();
			if (file.extension) {
				iconEl.classList.add(`fiv-icon-${file.extension.toLowerCase()}`);
			}
		}

		if (typeof file.message === 'string' && msgEl) {
			msgEl.innerText = file.message || '';
		}

		// Type & preview
		this._setThumbnailType(thumbnailEl, file.isImage() ? 'image' : 'document');

		if (file.isImage()) {
			if (thumbBg) {
				if (file.thumbnail) {
					thumbnailEl.classList.add('has-thumb');
					thumbnailEl.classList.remove('no-preview');
					thumbBg.style.backgroundImage = `url('${file.thumbnail}')`;
				} else {
					// No preview url
					thumbnailEl.classList.add('no-preview');
					thumbnailEl.classList.remove('has-thumb');
					thumbBg.style.backgroundImage = '';
				}
			}
		} else {
			// Non-image: explicitly no preview
			thumbnailEl.classList.add('no-preview');
			if (thumbBg) thumbBg.style.backgroundImage = '';
		}
	}

	_renderOptionsInto(file, thumbnailEl) {
		const menu = thumbnailEl.querySelector('[data-role="menu"]');

		if (!menu) {
			return;
		}

		const globalEntries = Object.entries(this.params.fileOptions || {}).map(([key, opt]) => [
			key,
			this._normalizeOption(opt),
		]);
		const perFileEntries = Array.from(file.options.entries());

		const map = new Map(globalEntries);
		perFileEntries.forEach(([k, v]) => map.set(k, v));

		let entries = Array.from(map.entries());
		if (file.error) {
			entries = entries.filter(([k]) => k === 'remove');
		}

		const availableEntries = entries.filter(([_, opt]) => {
			if (file.locked && opt.lockSensitive) return false; // optional: hide dangerous ops when locked
			try {
				return typeof opt.available === 'function' ? !!opt.available(file) : true;
			} catch (e) {
				return false;
			}
		});

		if (!availableEntries.length) {
			const dropdownRoot = menu.closest('.dropdown') || menu.parentElement;
			if (dropdownRoot) dropdownRoot.remove();
			else menu.remove();
			return;
		}

		menu.innerHTML = '';
		let itemCount = 0;

		availableEntries.forEach(([key, opt]) => {
			itemCount++;
			let optionCaption = typeof opt.caption == 'function' ? opt.caption(file) : opt.caption;

			const a = document.createElement('a');
			a.className = 'dropdown-item';
			a.setAttribute('data-action', key);
			a.innerHTML = `
        <i class="icon-${opt.icon}">x</i>
        <span>${optionCaption}</span>
      `.trim();
			a.addEventListener('click', (ev) => {
				ev.preventDefault();
				if (typeof opt.callback === 'function') {
					opt.callback(file, thumbnailEl, this);
					this.syncIds();
				}
			});
			menu.appendChild(a);
		});

		thumbnailEl.dataset.optionCount = String(itemCount > 1 ? 'many' : 'one');
	}

	_setThumbnailType(thumbnailEl, type) {
		const classes = thumbnailEl.className.split(' ');
		const filtered = classes.filter((c) => !/\bfile-\S+/.test(c));
		thumbnailEl.className = filtered.join(' ').trim();
		thumbnailEl.classList.add(`file-${type}`);

		if (type === 'image') {
			thumbnailEl.classList.remove('no-preview');
		} else {
			thumbnailEl.classList.add('no-preview');
		}
	}

	_applyStateClasses(thumbnailEl, { ready, error }) {
		thumbnailEl.classList.remove('completed', 'success', 'ready', 'error');

		if (ready) {
			thumbnailEl.classList.add('completed', 'success', 'ready');
		}
		if (error) {
			thumbnailEl.classList.add('completed', 'error');
		}
	}

	/*** Delete ***/
	deleteFile(file, thumbnailEl, { silent = false } = {}) {
		if (file?.id && this.params.deleteroute.length > 0) {
			const url = this.params.deleteroute;
			const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': csrfToken || '',
				},
				body: JSON.stringify({ id: file.id }),
			}).catch(() => {});
		}

		if (thumbnailEl && thumbnailEl.remove) thumbnailEl.remove();
		const idx = this.files.findIndex((f) => f._uid === file._uid);
		if (idx !== -1) this.files.splice(idx, 1);

		this._checkLimits();
		this.syncIds();
		if (!silent) this.trigger('queueChange', this.files.slice());
	}

	/*** Ordering + hidden input sync ***/
	syncIds() {
		const orderedEls = Array.from(this.list.querySelectorAll('.upload-file'));
		const orderedUids = orderedEls.map((el) => el.getAttribute('data-uid')).filter(Boolean);

		const ids = [];
		orderedUids.forEach((uid) => {
			const f = this.files.find((x) => x._uid === uid);
			if (f && typeof f.id === 'number' && !isNaN(f.id) && f.id > 0) ids.push(f.id);
		});

		this.clearIds();

		for (let i = 0; i < ids.length; i++) {
			let el = document.createElement('input');
			el.dataset.role = 'file-id';
			el.name = this.fieldName + `[${ids[i]}][id]`;
			el.value = ids[i];
			el.type = 'hidden';

			let file = this.getFile(ids[i]);

			this.element.appendChild(el);

			for (let key in file.properties) {
				let value = file.properties[key];

				if (typeof value === 'boolean') {
					value = value ? '1' : '0';
				}

				let el = document.createElement('input');
				el.dataset.role = 'file-id';
				el.name = this.fieldName + `[${ids[i]}][properties][${key}]`;
				el.value = value;
				el.type = 'hidden';
				this.element.appendChild(el);
			}
		}
	}

	clearIds() {
		this.element.querySelectorAll('[data-role="file-id"]').forEach((e) => e.remove());
	}

	_reconcileOrderFromDOM() {
		const orderedEls = Array.from(this.list.querySelectorAll('.upload-file'));
		const orderedUids = orderedEls.map((el) => el.getAttribute('data-uid')).filter(Boolean);

		const newOrder = [];
		orderedUids.forEach((uid) => {
			const f = this.files.find((x) => x._uid === uid);
			if (f) newOrder.push(f);
		});

		this.files = newOrder;
	}

	_toggleSubmitDisabled(disabled) {
		if (this.submitButton) this.submitButton.disabled = !!disabled;
	}

	_checkLimits() {
		const count = this.files.length;
		const limit = Number(this.params.limit);
		const isUnlimited = limit <= 0;

		if (count > 0) {
			this.element.classList.add('has-files');
			this.element.classList.remove('no-files');
		} else {
			this.element.classList.remove('has-files');
			this.element.classList.add('no-files');
		}

		if (!isUnlimited && count >= limit) {
			this.element.classList.add('limit-reached');
		} else {
			this.element.classList.remove('limit-reached');
		}

		if (isUnlimited) {
			return;
		}

		if (count >= limit) {
			if (this.triggerEl) this.triggerEl.classList.add('hidden');
		} else {
			if (this.triggerEl) this.triggerEl.classList.remove('hidden');
		}
	}

	_normalizeOption(opt) {
		const normalized = {
			caption: opt?.caption,
			icon: opt?.icon ?? '',
			lockSensitive: !!opt?.lockSensitive,
			available: typeof opt?.available === 'function' ? opt.available : () => true,
			callback: typeof opt?.callback === 'function' ? opt.callback : () => {},
		};

		return normalized;
	}

	_resolveFile(target) {
		if (!target) return null;
		if (target instanceof ManagedFile) return target;

		// by id
		if (typeof target === 'number') {
			return this.files.find((f) => f.id === target) || null;
		}

		// by thumbnail element
		if (target.nodeType === 1) {
			const uid = target.getAttribute('data-uid');
			return this.files.find((f) => f._uid === uid) || null;
		}

		return null;
	}

	onFileSelect(files) {
		this._onFileSelect(Array.from(files || []));
	}

	updateThumbnail(thumbnailEl, dataOrFile) {
		const file =
			dataOrFile instanceof ManagedFile
				? dataOrFile
				: this._resolveFile(thumbnailEl) || new ManagedFile(dataOrFile || {});
		this._paintThumbnail(thumbnailEl, file);
	}
}
