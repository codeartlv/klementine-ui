<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Label extends Component
{
	public function __construct(
		public string $text = '',
		public bool $required = false,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::label');
	}
}
