<?php

namespace Codeart\Klementine\View\Components\Forms;

class FormError implements FormErrorInterface
{
	public function __construct(
		public string $message,
		public ?string $field = null,
	) {
	}

	public function getMessage(?string $locale = null): string
	{
		return $this->message;
	}

	public function getField(): ?string
	{
		return $this->field;
	}
}
