<wa-callout {{$attributes}} variant="{{$variant}}" size="{{$size}}">
	<div>
		@php
			$icon = match($variant) {
				'success' => 'check',
				'danger' => 'circle-xmark',
				'warning' => 'exclamation-triangle',
				default => null,
			};
		@endphp

		@if($icon)
			<x-ui-icon name="{{ $icon }}" size="{{$size}}" />
		@endif

		<div>
			@if($title)
				<strong>{{ $title }}</strong>
			@endif
			{{$message}}
		</div>
	</div>
</wa-callout>
