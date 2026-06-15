<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Input extends Component
{
	public function __construct(
		public string $name = '',
		public string $label = '',
		public string $type = 'text',
		public string $value = '',
		public string $hint = '',
		public bool $required = false,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::input');
	}
}
