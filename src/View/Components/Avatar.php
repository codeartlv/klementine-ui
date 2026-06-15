<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Avatar extends Component
{
	public function __construct(
		public ?string $initials = null,
		public ?string $image = null,
		public ?string $label = null,
		public ?string $loading = null,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::avatar');
	}
}
