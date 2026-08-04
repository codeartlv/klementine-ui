@props([
	'icon' => null,
	'icon_end' => null,
])

<wa-button type="{{ $type }}" {{ $attributes->merge(['class' => $span ? 'block' : '']) }}>
	@if($icon)
		<wa-icon slot="start" name="{{ $icon }}"></wa-icon>
	@endif

	{{ $label }}

	@if($icon_end)
		<wa-icon slot="end" name="{{ $icon_end }}"></wa-icon>
	@endif
</wa-button>

