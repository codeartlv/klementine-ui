<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Badge extends Component
{
	public function __construct(
		public string $label = '',
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::badge');
	}
}
