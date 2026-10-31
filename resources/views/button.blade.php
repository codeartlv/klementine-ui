@props([
	'icon' => null,
	'icon_end' => null,
	'label' => null,
])

@php
$attributes = $attributes->merge(['class' => $span ? 'block' : '']);

if (!$label) {
	$attributes = $attributes->merge(['class' => 'no-label']);
}
@endphp

<wa-button type="{{ $type }}" {{ $attributes }}>
	@if($icon)
		<wa-icon slot="start" name="{{ $icon }}"></wa-icon>
	@endif

	{{ $label }}

	@if($icon_end)
		<wa-icon slot="end" name="{{ $icon_end }}"></wa-icon>
	@endif
</wa-button>


