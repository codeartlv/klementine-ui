<?php

namespace Codeart\Klementine\View\Components\Forms;

use Illuminate\View\Component;

class FormElement extends Component
{
	public function __construct(
		public string $method = 'post',
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::form');
	}
}
