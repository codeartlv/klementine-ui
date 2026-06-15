<?php

namespace Codeart\Klementine\View\Components\Uploader;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

/**
 * @implements Arrayable<string, mixed>
 */
readonly class UploadedFile implements JsonSerializable, Arrayable
{
	/**
	 * @param mixed|null $id
	 * @param array<string,mixed> $properties
	 * @return void
	 */
	public function __construct(
		public mixed $id = null,
		public array $properties = [],
	) {
	}

	public function jsonSerialize(): mixed
	{
		return $this->toArray();
	}

	/**
	 * @return array<string, mixed>
	 */
	public function toArray(): array
	{
		return [
			'id' => $this->id
		] + $this->properties;
	}
}
