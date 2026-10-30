@props([
	'icon' => null,
	'icon_end' => null,
	'id' => null,
	'label' => null,
	'required' => false,
	'hint' => null,
	'name' => '',
	'value' => '',
	'source' => '',
	'minLength' => 1,
])

@php
	if (!$id) {
		$id = 'ac'.uniqid();
	}

	$classes = ['autocomplete'];

	if ($icon_end) {
		$classes[] = 'has-icon';
		$classes[] = 'has-end-icon';
	}

	if (!$label) {
		$attributes = $attributes->merge([
			'class' => 'no-label-text',
		]);
	}

	if ($required) {
		$attributes = $attributes->merge([
			'class' => 'required',
		]);
	}

	$attributes = $attributes->merge([
		'autocomplete' => 'off',
	]);
@endphp

<div
	class="form-element {{ implode(' ', $classes) }}"
	x-data="autocomplete({{ \Illuminate\Support\Js::from($source) }}, {{ (int) $minLength }}, {{ \Illuminate\Support\Js::from(__('klementine-ui::components.autocomplete.no_results')) }})"
>
	<div class="autocomplete__field">
		<wa-input
			x-ref="field"
			{{ $attributes }}
			label="{{ $label }}"
			name="{{ $name }}"
			value="{{ $value }}"
			id="{{ $id }}"
			@if ($required) required @endif
		>
			@if ($icon)
				<wa-icon slot="start" name="{{ $icon }}"></wa-icon>
			@endif

			@if ($icon_end)
				<wa-icon slot="end" name="{{ $icon_end }}"></wa-icon>
			@endif
		</wa-input>

		<div class="autocomplete__results" x-ref="results"></div>
	</div>

	@if ($hint)
		<div class="form-hint">{{ $hint }}</div>
	@endif
</div>
