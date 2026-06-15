<?php

namespace Codeart\Klementine\View\Components\Uploader;

use ArrayAccess;

/**
 * @implements ArrayAccess<string, mixed>
 */
class ReceivedFile implements ArrayAccess
{
	/**
	 * @param int $id
	 * @param null|string $caption
	 * @param array<string,mixed> $properties
	 * @return void
	 */
	public function __construct(
		public int $id,
		public ?string $caption,
		public array $properties = [],
	) {
	}

	public function offsetExists($offset): bool
	{
		return property_exists($this, $offset);
	}

	public function offsetGet($offset): mixed
	{
		return $this->$offset ?? null;
	}

	public function offsetSet($offset, $value): void
	{
		$this->$offset = $value;
	}

	public function offsetUnset($offset): void
	{
		unset($this->$offset);
	}
}
