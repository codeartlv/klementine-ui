<?php

namespace Codeart\Klementine\Http\Controllers;

use Codeart\Klementine\View\Components\Forms\FormError;
use Codeart\Klementine\View\Components\Forms\FormResponse;
use Codeart\Klementine\View\Components\Forms\FormSuccess;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;

class TestController
{
	public function index(): View
	{
		return view('klementine-ui::preview.index');
	}

	public function formTestError(): JsonResponse
	{
		$response = new FormResponse();
		$response->addError(new FormError('Name is required', 'name'));
		$response->addError(new FormError('Global message', 'none'));
		
		return response()->json($response);
	}

	public function dialogSuccess(): View
	{
		return view('klementine-ui::preview.dialog-success');
	}

	public function formTestSuccess(): JsonResponse
	{
		$response = new FormResponse();
		$response->setSuccess(new FormSuccess('Form submitted successfully'));
		
		return response()->json($response);
	}
}
