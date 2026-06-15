<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\View\Component;

class Datepicker extends Component
{
	public function __construct(
		public string $name = 'date',
		public ?\DateTime $value = null,
		public string $displayFormat = 'd.m.Y',
	) {
		;
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::datepicker');
	}
}
