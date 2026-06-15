<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Password extends Component
{
	public function __construct(
		public ?string $label = '',
		public ?string $policy = '',
		public ?string $name = '',
		public ?string $value = '',
		public bool $required = false,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::password');
	}
}
