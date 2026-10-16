@props([
	'icon' => null,
	'icon_end' => null,
	'id' => null,
	'label' => null,
])

@php

	if(!$id) {
		$id = 'inp'.uniqid();
	}

	$classes = [];

	if ($icon_end) {
		$classes[] = 'has-icon';
		$classes[] = 'has-end-icon';
	}

	if (!$label) {
		$attributes = $attributes->merge([
			'class' => 'no-label-text'
		]);
	}
@endphp

<div class="form-element {{implode(' ', $classes)}}">
	<wa-input {{ $attributes }} label="{{$label}}" name="{{ $name }}" value="{{ $value }}" id="{{$id}}" >
		@if($icon)
			<wa-icon slot="start" name="{{ $icon }}"></wa-icon>
		@endif

		@if($icon_end)
			<wa-icon slot="end" name="{{ $icon_end }}"></wa-icon>
		@endif
	</wa-input>


	@if ($hint)
		<div class="form-hint">{{ $hint }}</div>
	@endif
</div>

