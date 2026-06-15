<div class="form-element">
	@if ($label)
		<x-ui-label :text="$label" :required="$required" />
	@endif

	<textarea class="form-input" name="{{ $name }}" {{ $attributes }}>{{ $value }}</textarea>

	@if ($hint)
		<div class="form-hint">{{ $hint }}</div>
	@endif
</div>
