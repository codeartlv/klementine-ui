<!DOCTYPE html>
<html class="">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=2, shrink-to-fit=no">
	<title>Klementine UI — Preview</title>

	<meta name="csrf-token" content="{{ csrf_token() }}" />

	@vite([
		'resources/js/app.js',
		'resources/css/app.css',
	])

	@include('klementine-ui::preview.partials.styles')
</head>
<body>
	<div class="container">
		<header class="page-header">
			<h1>Klementine UI kit</h1>
			<wa-switch id="theme-toggle" size="l">Dark Mode</wa-switch>
		</header>

		@foreach ([
			'colors',
			'avatar',
			'badge',
			'button',
			'callout',
			'checkbox',
			'radio',
			'dialog',
			'drawer',
			'select',
			'textarea',
			'datepicker',
			'password',
			'uploader',
			'input',
			'form',
		] as $component)
			<div class="component-block">
				@include('klementine-ui::preview.components.' . $component)
			</div>
		@endforeach
	</div>

	@include('klementine-ui::preview.partials.scripts')
</body>
</html>
