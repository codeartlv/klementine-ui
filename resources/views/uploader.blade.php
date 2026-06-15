@php
$params = $attributes->getAttributes();
$params['files'] = $files ?? [];
$params['maxsize'] = ((int) ini_get('upload_max_filesize'));

$params['uploadroute'] = $params['uploadroute'] ?? ($params['data-uploadroute'] ?? '');
$params['deleteroute'] = $params['deleteroute'] ?? ($params['data-deleteroute'] ?? '');
$params['croproute'] = $params['croproute'] ?? ($params['data-croproute'] ?? '');
$params['submitbtn'] = $params['submitbtn'] ?? ($params['data-submitbtn'] ?? '');
$params['limit'] = $params['limit'] ?? ($params['data-limit'] ?? null);

$params['messages'] = [
	'uploadMaxFilesize' => __('klementine-ui::components.uploader.upload_max_filesize', ['max' => $params['maxsize']]),
	'uploadError' => __('klementine-ui::components.uploader.upload_error'),
];

$limit = (int) ($params['limit'] ?? 1);
$placeholder = $limit === 1 ? __('klementine-ui::components.uploader.upload_placeholder_single') : __('klementine-ui::components.uploader.upload_placeholder');
@endphp

<div class="uploader uploader--{{$class}}" x-data="fileUploader" {{$attributes}}>
	<label class="uploader__trigger" data-role="trigger">
		<input type="file" name="{{$name}}" />
		<span class="uploader__trigger-icon" aria-hidden="true">
			<x-ui-icon name="upload" />
		</span>
		<span class="uploader__trigger-text">{{ $placeholder }}</span>
	</label>

	<div data-role="list" class="upload-area"></div>

	<script data-role="data" type="application/ld+json">
		@json($params)
	</script>

	<template data-role="thumbnail">
		<div class="upload-file uploader__item" data-id="0">
			<div class="upload-file__left">
				<div class="upload-file__spinner">
					<div data-role="spinner-container"></div>
				</div>
				<figure data-role="thumbnail"></figure>
				<span class="upload-file__check ri ri-checkmark"></span>
				<span class="upload-file__error-icon ri ri-alert"></span>
			</div>

			<div class="upload-file__center">
				<span class="upload-file__icon fiv-sqo" data-role="file-icon"></span>
				<span class="upload-file__filename" data-role="filename"></span>
				<div class="upload-file__msg" data-role="message"></div>
			</div>

			<div class="upload-file__menu" data-role="menu"></div>
		</div>
	</template>

	{{ $slot }}
</div>