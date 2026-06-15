<?php

namespace Codeart\Klementine\View\Components\Uploader;

use Illuminate\View\Component;

class Uploader extends Component
{
	/**
	 * @param string $class
	 * @param null|string $name
	 * @param array<int,UploadedFile> $files
	 * @return void
	 */
	public function __construct(
		public string $class = 'default',
		public ?string $name = 'files',
		public array $files = [],
	) {
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::uploader');
	}
}
