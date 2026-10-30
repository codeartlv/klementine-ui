<?php

namespace Codeart\Klementine\View\Components\Autocomplete;

use Illuminate\Contracts\Support\Arrayable;

/**
 * JSON body expected by the autocomplete field: `{ suggestions: [...] }`.
 *
 * @implements Arrayable<string, mixed>
 */
class Response implements Arrayable
{
	/**
	 * @param list<Entry> $items
	 */
	public function __construct(
		private array $items,
	) {
	}

	/**
	 * @return array{suggestions: list<array{value: string, data: array<string, mixed>}>}
	 */
	public function toArray(): array
	{
		return [
			'suggestions' => array_map(
				static fn (Entry $item): array => $item->toArray(),
				$this->items,
			),
		];
	}
}
