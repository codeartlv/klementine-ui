<?php

namespace Codeart\Klementine\View\Components;

use DateTimeInterface;
use Illuminate\View\Component;

class Datepicker extends Component
{
	public string $min = '';

	public string $max = '';

	public function __construct(
		public string $name = 'date',
		public ?\DateTime $value = null,
		public string $displayFormat = 'd.m.Y',
		string|DateTimeInterface|null $min = null,
		string|DateTimeInterface|null $max = null,
	) {
		$this->min = $this->normalizeBound($min);
		$this->max = $this->normalizeBound($max);
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::datepicker');
	}

	private function normalizeBound(string|DateTimeInterface|null $bound): string
	{
		if ($bound instanceof DateTimeInterface) {
			return $bound->format('Y-m-d');
		}

		if (! is_string($bound)) {
			return '';
		}

		$bound = trim($bound);

		if ($bound === 'today' || preg_match('/^\d{4}-\d{2}-\d{2}$/', $bound) === 1) {
			return $bound;
		}

		return '';
	}
}
