<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Callout extends Component
{
	public function __construct(
		public ?string $variant = 'neutral',
		public ?string $size = 'm',
		public ?string $type = null,
		public ?string $message = null,
		public ?string $title = null,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::callout');
	}
}
