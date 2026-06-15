<?php

namespace Codeart\Klementine\View\Components\Forms;

interface FormErrorInterface
{
	/**
	 * Return field associated with error
	 * @return null|string
	 */
	public function getField(): ?string;

	/**
	 * Return error message
	 *
	 * @param null|string $locale
	 * @return string
	 */
	public function getMessage(?string $locale = null): string;
}
