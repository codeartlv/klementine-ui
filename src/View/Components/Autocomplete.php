<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Autocomplete extends Component
{
	public function __construct(
		public string $name = '',
		public string $label = '',
		public string $value = '',
		public string $hint = '',
		public string $source = '',
		public int $minLength = 1,
		public bool $required = false,
		public bool $lookup = false,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::autocomplete');
	}
}
