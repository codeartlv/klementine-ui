<?php

namespace Codeart\Klementine\View\Components\Forms;

use Illuminate\Contracts\Support\Arrayable;

/**
 * Generic form response class to be used in submitting form with form component.
 *
 * @implements Arrayable<string, mixed>
 */
class FormResponse implements Arrayable
{
	/**
	 * Additional payload from form response
	 *
	 * @var array
	 */
	protected $payload = [];

	/**
	 * Form errors
	 *
	 * @var array
	 */
	protected $errors = [];

	/**
	 * Success actions
	 *
	 * @var array
	 */
	protected array $actions = [];

	/**
	 * Success message
	 *
	 * @var null|FormSuccess
	 */
	protected ?FormSuccess $success = null;

	/**
	 * @inheritDoc
	 * @return array<string, mixed>
	 */
	public function toArray(): array
	{
		$errors = [];

		foreach ($this->errors as $error) {
			$field = $error->getField() ?? '*';

			if (!isset($errors[$field])) {
				$errors[$field] = [];
			}
			
			$errors[$field][] = $error->getMessage();
		}

		$actions = [];
		foreach ($this->actions as $action) {
			$actions[$action->action] = $action->value;
		}

		return [
			'status' => !$this->hasError(),
			'fields' => $errors,
			'actions' => $actions,
			'data' => $this->payload,
			'message' => $this->success?->message,
		];
	}

	/**
	 * Set payload value
	 *
	 * @param mixed $name
	 * @param mixed $value
	 * @return void
	 */
	public function __set($name, $value)
	{
		$this->payload[$name] = $value;
	}

	/**
	 * Get payload value
	 *
	 * @param mixed $name
	 * @return mixed
	 */
	public function __get($name)
	{
		return $this->payload[$name] ?? null;
	}
	
	/**
	 * Does operation resulted in an error?
	 *
	 * @return boolean
	 */
	public function hasError(): bool
	{
		return !empty($this->errors);
	}

	/**
	 * Add form error
	 *
	 * @param FormErrorInterface $error
	 * @return void
	 */
	public function addError(FormErrorInterface $error): void
	{
		$this->errors[] = $error;
	}

	/**
	 * Add success action
	 *
	 * @param string $action
	 * @param mixed $value
	 * @return void
	 */
	public function addSuccessAction(string $action, mixed $value): void
	{
		$this->actions[] = new FormAction($action, $value);
	}

	/**
	 * Set success message
	 *
	 * @param FormSuccess $success
	 * @return void
	 */
	public function setSuccess(FormSuccess $success): void
	{
		$this->success = $success;
		$this->errors = [];
	}
}
