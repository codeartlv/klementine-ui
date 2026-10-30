<?php

namespace Codeart\Klementine\View\Components\Autocomplete;

use Illuminate\Contracts\Support\Arrayable;

/**
 * One suggestion. `value` is the label shown in the list.
 * `data.id` is the stored key, and any extra fields are merged into `data`.
 *
 * @implements Arrayable<string, mixed>
 */
class Entry implements Arrayable
{
	/**
	 * @param array<string, mixed> $data
	 */
	public function __construct(
		private mixed $id,
		private string $label,
		private array $data = [],
	) {
	}

	/**
	 * @return array{value: string, data: array<string, mixed>}
	 */
	public function toArray(): array
	{
		return [
			'value' => $this->label,
			'data' => array_merge(['id' => $this->id], $this->data),
		];
	}
}
