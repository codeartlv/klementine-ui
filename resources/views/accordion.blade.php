<wa-accordion>
	@foreach($items as $item)
		<wa-accordion-item label="{{$item->caption}}">
			{!! $item->contents !!}
		</wa-accordion-item>
	@endforeach
</wa-accordion>