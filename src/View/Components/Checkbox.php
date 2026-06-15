<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Checkbox extends Component
{
	public function __construct(
		public string $value = '1',
		public string $label = '',
		public bool $checked = false,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::checkbox');
	}
}
