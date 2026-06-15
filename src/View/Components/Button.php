<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Button extends Component
{
	public function __construct(
		public string $type = 'submit',
		public string $label = '',
		public bool $span = false,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::button');
	}
}
