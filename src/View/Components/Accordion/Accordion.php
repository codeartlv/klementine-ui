<?php

namespace Codeart\Klementine\View\Components\Accordion;

use Illuminate\View\Component;

class Accordion extends Component
{
	public function __construct(
		public array $items = [],
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::accordion');
	}
}
