<?php

namespace Codeart\Klementine\View\Components\Accordion;

use Illuminate\Contracts\Support\Arrayable;

class AccordionItem implements Arrayable
{
	public function __construct(
		public string $caption,
		public string $contents,
	) {
		;
	}

	public function toArray()
	{
		return [
			'caption' => $this->caption,
			'contents' => $this->contents,
		];
	}
}
