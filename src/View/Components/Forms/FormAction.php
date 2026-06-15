<?php

namespace Codeart\Klementine\View\Components\Forms;

readonly class FormAction
{
	public function __construct(
		public string $action,
		public mixed $value,
	) {
	}
}
