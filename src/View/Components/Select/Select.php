<?php

namespace Codeart\Klementine\View\Components\Select;

use Illuminate\View\Component;

class Select extends Component
{
	public function __construct(
		public array $options = [],
		public bool $required = false,
		public ?string $startIcon = null,
		public ?string $endIcon = null,
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::select');
	}
}
