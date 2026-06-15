<wa-select {{$attributes}}>
	@if($startIcon)
		<span slot="start">
			<x-ui-icon name="{{$startIcon}}" />
		</span>
	@endif
	@if($endIcon)
		<span slot="end">
			<x-ui-icon name="{{$endIcon}}" />
		</span>
	@endif
	@foreach ($options as $item)
		@if (method_exists($item, 'options'))
			<small>{{$item->label}}</small>
			@foreach ($item->options() as $option)
				<wa-option value="{{$option->value}}" {{$option->disabled ? 'disabled':''}} {{$option->selected?'selected':''}}>{{$option->label}}</wa-option>
			@endforeach

			@if(!$loop->last)
				<wa-divider></wa-divider>
			@endif
		@else
			<wa-option value="{{$item->value}}" {{$item->disabled ? 'disabled':''}} {{$item->selected?'selected':''}}>{{$item->label}}</wa-option>
		@endif
	@endforeach
</wa-select>