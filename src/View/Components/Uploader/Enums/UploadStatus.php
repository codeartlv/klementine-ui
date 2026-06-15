<?php

namespace Codeart\Klementine\View\Components\Uploader\Enums;

/**
 * File upload status enumeration.
 */
enum UploadStatus: string
{
	case SUCCESS = 'success';
	case FAILED = 'failed';
}
