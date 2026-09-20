<wa-pagination
	{{ $attributes }}
	total="{{ $total }}"
	page="{{ $page }}"
	page-size="{{ $pageSize }}"
	appearance="{{ $appearance }}"
	format="{{ $format }}"
	label="{{ $label }}"
	@if ($hrefTemplate) href-template="{{ $hrefTemplate }}" @endif
	@if ($siblingCount !== null) sibling-count="{{ $siblingCount }}" @endif
	@if ($boundaryCount !== null) boundary-count="{{ $boundaryCount }}" @endif
	@if ($withEdges) with-edges @endif
	@if ($withoutNav) without-nav @endif
	@if ($withSummary) with-summary @endif
	@if ($hideSinglePage) hide-single-page @endif
	@if ($disabled) disabled @endif
>{{ $slot }}</wa-pagination>
