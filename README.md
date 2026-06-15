# Klementine UI

Laravel Blade component library built on [Web Awesome](https://webawesome.com/) and Alpine.js. Provides form controls, overlays, file uploads, and a shared design token layer for Laravel applications.

## Requirements

- PHP 8.3+
- Laravel 13+
- Node.js 20+ with npm
- Vite (via `laravel-vite-plugin`)

## Installation

### 1. Composer

Add the package to your Laravel project. For local development, use a path repository:

```bash
composer require codeartlv/klementine-ui
```

The service provider is auto-discovered via Laravel package discovery.

### 2. Publish configuration (optional)

```bash
php artisan vendor:publish --tag=klementine-config
```

This creates `config/klementine.php`:

```php
return [
    'component_prefix' => 'ui', // Blade tags become <x-ui-button>, <x-ui-input>, etc.
];
```

If the config file is not published, the prefix defaults to `ui`.

### 3. Frontend dependencies

After `composer require`, install the package's npm dependencies:

```bash
php artisan klementine-ui:install
```

This runs `npm install` in the package directory (works for path repos and `vendor/codeartlv/klementine-ui`). Node.js must be available on the machine.

### 4. Automate with Composer (optional)

The install command does not run automatically when the package is required. To run it after every `composer install` or `composer update`, add hooks to your **application's** root `composer.json`:

```json
{
	"scripts": {
		"post-install-cmd": ["@php artisan klementine-ui:install --ansi"],
		"post-update-cmd": ["@php artisan klementine-ui:install --ansi"]
	}
}
```

If you already have `post-install-cmd` or `post-update-cmd` entries, append the artisan line to those arrays instead of replacing them:

```json
{
	"scripts": {
		"post-update-cmd": [
			"@php artisan vendor:publish --tag=laravel-assets --ansi --force",
			"@php artisan klementine-ui:install --ansi"
		]
	}
}
```

You can also call it from a custom setup script:

```json
{
	"scripts": {
		"setup": [
			"composer install",
			"@php artisan klementine-ui:install --ansi",
			"npm install --ignore-scripts",
			"npm run build"
		]
	}
}
```

| Hook               | Runs when                                                |
| ------------------ | -------------------------------------------------------- |
| `post-install-cmd` | `composer install`                                       |
| `post-update-cmd`  | `composer update`, `composer require`, `composer remove` |

### 5. Vite alias

Add a path alias in `vite.config.mjs` so imports resolve to the package resources:

```js
import path from 'path';

export default defineConfig({
	resolve: {
		alias: {
			'@klementine-ui': path.resolve('klementine-ui/resources'),
		},
	},
});
```

### 6. Application entry point

Create or update `resources/js/app.js`:

```js
import KlementineUI from '@klementine-ui/js';

KlementineUI.configureAlpine((Alpine) => {
	// Register custom Alpine components (optional)
}).configureWebAwesome((registerIconLibrary) => {
	// Configure Web Awesome settings (optional)
});

KlementineUI.start();
```

Include Vite assets in your layout:

```blade
@vite(['resources/js/app.js', 'resources/css/app.css'])
```

Add a CSRF meta tag for AJAX forms and overlays:

```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

### 7. Styles

Import Klementine styles in your app CSS (the preview app uses the parent `resources/css/app.css` which should import or mirror the package layer structure). The package stylesheet entry is:

```css
@import '@klementine-ui/css/app.css';
```

It layers Web Awesome, design tokens (`variables.css`), form styles, and per-component CSS.

### 8. Web Awesome assets

Web Awesome static assets must be available at `/build/webawesome` in production. Configure the base path in `KlementineUI.setupWebAwesome()` (handled automatically when using the package entry point).

## Preview

When running locally, open the component preview at:

```
http://localhost/klementine-ui
```

(Requires the package dev routes — registered on the `localhost` domain.)

Each component demo lives in `resources/views/preview/components/`.

## Architecture

| Layer             | Location                             | Purpose                            |
| ----------------- | ------------------------------------ | ---------------------------------- |
| Blade components  | `src/View/Components/`               | Server-rendered UI tags            |
| Blade views       | `resources/views/`                   | Component markup                   |
| Alpine components | `resources/js/alpine-components/`    | Auto-registered as `Alpine.data()` |
| UI factories      | `resources/js/ui-components/`        | Programmatic DOM builders          |
| Overlay loader    | `resources/js/lib/overlay-loader.js` | Shared dialog/drawer AJAX logic    |

Alpine components are registered automatically from filenames:

| File               | Alpine name     | Usage                               |
| ------------------ | --------------- | ----------------------------------- |
| `dialog.js`        | `dialog`        | `x-data="dialog(url, caption, id)"` |
| `drawer.js`        | `drawer`        | `x-data="drawer(url, caption, id)"` |
| `form.js`          | `form`          | `x-data="form"` on `<x-ui-form>`    |
| `fileUploader.js`  | `fileUploader`  | Used by `<x-ui-uploader>`           |
| `passwordField.js` | `passwordField` | Used by `<x-ui-password>`           |
| `datepicker.js`    | `datepicker`    | Used by `<x-ui-datepicker>`         |

---

## Components

All examples use the default `ui` prefix: `<x-ui-{name}>`. Replace `ui` if you changed `component_prefix` in config.

### Avatar

```blade
<x-ui-avatar image="https://example.com/photo.jpg" loading="lazy" />
<x-ui-avatar initials="WA" />
```

Additional Web Awesome attributes (`shape`, `size`, etc.) can be passed through `{{ $attributes }}`.

### Badge

```blade
<x-ui-badge label="New" variant="primary" />
<x-ui-badge label="Draft" variant="neutral" appearance="outlined" pill />
<x-ui-badge label="3" variant="danger" attention="pulse" pill />
```

| Prop / attribute | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `label`          | Badge text                                           |
| `variant`        | `primary`, `success`, `neutral`, `warning`, `danger` |
| `appearance`     | `filled`, `outlined`, `filled-outlined`              |
| `pill`           | Rounded pill shape                                   |
| `attention`      | e.g. `pulse` for animation                           |

### Button

```blade
<x-ui-button label="Save" variant="brand" appearance="filled" />
<x-ui-button type="submit" label="Submit" variant="brand" span />
```

| Prop    | Description                 |
| ------- | --------------------------- |
| `label` | Button text                 |
| `type`  | `button`, `submit`, `reset` |
| `span`  | Full-width block button     |

Pass Web Awesome attributes (`variant`, `appearance`, `size`, `disabled`, `loading`) as HTML attributes.

### Callout

```blade
<x-ui-callout
    title="Heads up"
    message="Something needs your attention."
    variant="warning"
/>
```

| Prop      | Description                                        |
| --------- | -------------------------------------------------- |
| `title`   | Optional heading                                   |
| `message` | Body text (supports HTML)                          |
| `variant` | `brand`, `success`, `warning`, `neutral`, `danger` |
| `size`    | `xs`, `s`, `m`, `l`, `xl`                          |

### Checkbox

```blade
<x-ui-checkbox name="agree" label="I agree" value="1" />
<x-ui-checkbox name="agree" label="With hint" hint="Required to continue" />
<x-ui-checkbox name="agree" label="Disabled" disabled />
```

### Radio

```blade
<x-ui-radio name="plan" label="Basic" value="basic" />
<x-ui-radio name="plan" label="Pro" value="pro" />
```

### Input

```blade
<x-ui-input name="name" label="Name" hint="Your full name" />
<x-ui-input name="email" label="Email" type="email" required />
```

| Prop       | Description                       |
| ---------- | --------------------------------- |
| `name`     | Field name                        |
| `label`    | Label text                        |
| `type`     | Input type (default `text`)       |
| `value`    | Initial value                     |
| `hint`     | Helper text below the field       |
| `required` | Shows required indicator on label |

### Textarea

```blade
<x-ui-textarea name="bio" label="Bio" hint="Tell us about yourself" />
```

### Select

```blade
@php
use Codeart\Klementine\View\Components\Select\Option;
use Codeart\Klementine\View\Components\Select\Group;

$options = [
    new Option('1', 'Option 1'),
    new Option('2', 'Option 2', selected: true),
];
@endphp

<x-ui-select name="country" label="Country" :options="$options" placeholder="Choose…" />
<x-ui-select name="tags" label="Tags" :options="$options" multiple />
```

Options can also be `Group` instances for grouped `<wa-option>` lists.

### Datepicker

```blade
<x-ui-datepicker name="date" label="Date" :value="$date" display-format="d.m.Y" />
```

Uses [Vanilla Calendar Pro](https://vanilla-calendar.pro/) with an Alpine `datepicker` component.

### Password

```blade
<x-ui-password
    name="password"
    label="Password"
    policy="min:8,max:64,lowercase,uppercase,number,special"
/>
```

Policy is a comma-separated rule string consumed by the `passwordField` Alpine component (live strength meter and rule checklist).

### Form

Wrap fields in a form that submits via AJAX and displays validation errors inline.

```blade
<x-ui-form method="post" action="{{ route('profile.update') }}">
    <x-ui-form-group>
        <x-ui-input name="name" label="Name" />
        <x-ui-input name="email" label="Email" type="email" />
        <x-ui-button type="submit" label="Save" variant="brand" span />
    </x-ui-form-group>
</x-ui-form>
```

**Server response** — return JSON using `FormResponse`:

```php
use Codeart\Klementine\View\Components\Forms\FormError;
use Codeart\Klementine\View\Components\Forms\FormResponse;
use Codeart\Klementine\View\Components\Forms\FormSuccess;

$response = new FormResponse();
$response->addError(new FormError('Name is required', 'name'));
return response()->json($response);

// Or on success:
$response = new FormResponse();
$response->setSuccess(new FormSuccess('Saved successfully'));
$response->addAction('redirect', '/dashboard');
return response()->json($response);
```

### Dialog

**Declarative (Blade):**

```blade
<x-ui-dialog label="Confirm" id="confirm-dialog">
    <p>Are you sure?</p>
    <div slot="footer">
        <x-ui-button label="Close" variant="brand" data-dialog="close" />
    </div>
</x-ui-dialog>

<button data-dialog="open confirm-dialog">Open</button>
```

**Alpine (load content on click):**

```blade
<a href="#" x-data="dialog('{{ route('items.edit', $item) }}', 'Edit item')">
    Edit
</a>
```

**JavaScript:**

```js
import Dialog from '@klementine-ui/js/ui-components/dialog.js';

const dialog = new Dialog({ id: 'edit-item', caption: 'Edit item' });

// Load HTML from URL
await dialog.open('/items/1/edit');

// Or wrap an existing element
await dialog.open(document.getElementById('my-panel'));

// Options
await dialog.open('/items/1/edit', { autoclose: true, animations: false });

dialog.on('close', () => {
	/* … */
});
dialog.close();
```

| Constructor param | Description                                     |
| ----------------- | ----------------------------------------------- |
| `id`              | CSS class suffix (`dialog--{id}`)               |
| `caption`         | Dialog title (maps to `label` on `<wa-dialog>`) |

| `open()` option | Description                                |
| --------------- | ------------------------------------------ |
| `autoclose`     | Enables `light-dismiss` on overlay click   |
| `animations`    | Set `false` to disable show/hide animation |

### Drawer

Same API as dialog, backed by `<wa-drawer>`:

```blade
<a href="#" x-data="drawer('{{ route('menu') }}', 'Menu')">Open menu</a>
```

```js
import Drawer from '@klementine-ui/js/ui-components/drawer.js';

const drawer = new Drawer({ id: 'menu', caption: 'Menu' });
await drawer.open('/navigation', { placement: 'start', autoclose: true });
```

Close buttons inside a drawer use `data-drawer="close"`.

### Uploader

```blade
<x-ui-uploader
    name="files"
    data-uploadroute="{{ route('upload') }}"
    data-deleteroute="{{ route('upload.delete') }}"
    data-limit="5"
/>
```

| Attribute          | Description                                         |
| ------------------ | --------------------------------------------------- |
| `data-uploadroute` | POST endpoint for file chunks                       |
| `data-deleteroute` | DELETE endpoint for removing files                  |
| `data-croproute`   | Optional crop endpoint                              |
| `data-limit`       | Max number of files (default `1`)                   |
| `data-submitbtn`   | Selector for submit button to disable during upload |

Translations for placeholders and error messages come from `lang/{locale}/components.php` under the `klementine-ui` namespace.

### Icon

```blade
<x-ui-icon name="upload" />
<x-ui-icon name="circle-xmark" size="l" />
```

### Form group

Layout wrapper for stacking form fields:

```blade
<x-ui-form-group>
    <x-ui-input name="first" label="First name" />
    <x-ui-input name="last" label="Last name" />
</x-ui-form-group>
```

---

## JavaScript API

### KlementineUI

```js
import KlementineUI from '@klementine-ui/js';

KlementineUI.configureAlpine((Alpine) => {
	Alpine.data('myComponent', () => ({
		/* … */
	}));
})
	.configureWebAwesome((registerIconLibrary) => {
		// Register custom icon libraries
	})
	.start();
```

`start()` loads all Alpine components from `alpine-components/` and calls `Alpine.start()`.

### UI component factories

For dynamic DOM (used internally by forms and overlays):

```js
import button from '@klementine-ui/js/ui-components/button.js';
import callout from '@klementine-ui/js/ui-components/callout.js';
import spinner from '@klementine-ui/js/ui-components/spinner.js';

document.body.appendChild(callout({ variant: 'danger', message: 'Error' }));
```

---

## Translations

Publish or extend translation files at `lang/{locale}/components.php`:

```php
return [
    'uploader' => [
        'upload_placeholder' => 'Upload files',
        'upload_max_filesize' => 'File exceeds the maximum size (:max MB)',
    ],
    'password_field' => [
        'password_hint' => [
            'lowercase' => 'Lowercase letter',
            // …
        ],
    ],
];
```

Loaded under the `klementine-ui::components.*` namespace.

---

## Development

```bash
# In the package directory
npm run dev

# In the Laravel app
npm run dev
php artisan serve
```

Visit `http://localhost/klementine-ui` for the live component preview.
