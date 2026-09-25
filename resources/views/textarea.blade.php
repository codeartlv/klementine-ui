@props([
	'id' => null,
])

@php

	if(!$id) {
		$id = 'inp'.uniqid();
	}
@endphp

<div class="form-element">
	@if ($label)
		<x-ui-label :text="$label" :required="$required" :for="$id" />
	@endif

	<textarea class="form-input" name="{{ $name }}" id="{{$id}}" {{ $attributes }}>{{ $value }}</textarea>

	@if ($hint)
		<div class="form-hint">{{ $hint }}</div>
	@endif
</div>
