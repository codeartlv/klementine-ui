<?php

namespace Codeart\Klementine\View\Components\Uploader;

use Illuminate\Contracts\Support\Arrayable;
use Codeart\Klementine\View\Components\Uploader\Enums\UploadStatus;

/**
 * @implements Arrayable<string, mixed>
 */
readonly class UploadResponse implements Arrayable
{
	public function __construct(
		public UploadStatus $status,
		public ?UploadedFile $file = null,
		public ?string $message = null,
	) {
		;
	}

	public function toArray()
	{
		return [
			'file' => $this->file?->toArray(),
			'error' => $this->status === UploadStatus::FAILED,
			'message' => $this->message,
		];
	}
}
