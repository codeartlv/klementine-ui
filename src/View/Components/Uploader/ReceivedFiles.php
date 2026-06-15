<?php

namespace Codeart\Klementine\View\Components\Uploader;

use Illuminate\Support\Collection;

/**
 * @extends Collection<int,ReceivedFile>
 */
class ReceivedFiles extends Collection
{
	/**
	 * @param mixed $data
	 * @return void
	 */
	public function __construct($data)
	{
		if (!is_array($data)) {
			$data = [];
		}

		$filteredData = [];

		foreach ($data as $value) {
			if ($value instanceof ReceivedFile) {
				$filteredData[] = $value;
			} elseif (is_array($value)) {
				$filteredData[] = new ReceivedFile(
					id: (int) ($value['id'] ?? 0),
					caption: $value['caption'] ?? null,
					properties: isset($value['properties']) && is_array($value['properties']) ?
						$value['properties'] :
						[],
				);
			} else {
				$filteredData[] = $value;
			}
		}

		parent::__construct($filteredData);
	}

	public static function fromPost(string $fieldName): self
	{
		$data = request()->post($fieldName);

		if (!is_array($data)) {
			$data = [];
		}

		return new self($data);
	}
}
