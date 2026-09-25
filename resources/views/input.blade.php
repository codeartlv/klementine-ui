@props([
	'icon' => null,
	'icon_end' => null,
	'id' => null,
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
@endphp

<div class="form-element">
	@if ($label)
		<x-ui-label :text="$label" :required="$required" :for="$id" />
	@endif

	<wa-input {{ $attributes }} name="{{ $name }}" value="{{ $value }}" id="{{$id}}" >
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
