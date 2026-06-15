<div class="form-element">
	@if ($label)
		<x-ui-label :text="$label" :required="$required" />
	@endif

	<input class="form-input" name="{{ $name }}" {{ $attributes }} value="{{ $value }}" />

	@if ($hint)
		<div class="form-hint">{{ $hint }}</div>
	@endif
</div>
