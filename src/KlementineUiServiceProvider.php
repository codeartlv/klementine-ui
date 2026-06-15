<?php

namespace Codeart\Klementine;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Codeart\Klementine\Console\InstallCommand;
use Codeart\Klementine\Http\Controllers\TestController;

class KlementineUiServiceProvider extends ServiceProvider
{
	public function boot(): void
	{
		if ($this->app->runningInConsole()) {
			$this->commands([
				InstallCommand::class,
			]);
		}

		$this->publishes([
			$this->getPackageConfigPath() . 'klementine.php' => config_path('klementine.php'),
		], 'klementine-config');

		$this->setupViews();

		$this->setupRoutes();

		$this->setupComponents();

		$this->loadTranslationsFrom(__DIR__.'/../lang', 'klementine-ui');
	}

	public function register(): void
	{
		//
	}

	protected function setupRoutes(): void
	{
		
		Route::domain('localhost')
			->prefix('klementine-ui')
			->name('klementine-ui.')
			->group(function () {
				Route::get('/', [TestController::class, 'index'])->name('index');

				Route::get('/dialog-test', [TestController::class, 'dialogSuccess'])->name('dialog.test-success');

				Route::post('/form-test/error', [TestController::class, 'formTestError'])->name('form.test-error');
				Route::post('/form-test/success', [TestController::class, 'formTestSuccess'])->name('form.test-success');
			});
	}

	protected function setupComponents(): void
	{
		$components = [
			'avatar' => \Codeart\Klementine\View\Components\Avatar::class,
			'badge' => \Codeart\Klementine\View\Components\Badge::class,
			'button' => \Codeart\Klementine\View\Components\Button::class,
			'callout' => \Codeart\Klementine\View\Components\Callout::class,
			'checkbox' => \Codeart\Klementine\View\Components\Checkbox::class,
			'datepicker' => \Codeart\Klementine\View\Components\Datepicker::class,
			'form' => \Codeart\Klementine\View\Components\Forms\FormElement::class,
			'input' => \Codeart\Klementine\View\Components\Input::class,
			'label' => \Codeart\Klementine\View\Components\Label::class,
			'password' => \Codeart\Klementine\View\Components\Password::class,
			'radio' => \Codeart\Klementine\View\Components\Radio::class,
			'select' => \Codeart\Klementine\View\Components\Select\Select::class,
			'textarea' => \Codeart\Klementine\View\Components\Textarea::class,
			'uploader' => \Codeart\Klementine\View\Components\Uploader\Uploader::class,
		];

		$prefix = config('klementine.component_prefix', 'ui');

		foreach ($components as $name => $class) {
			Blade::component($prefix . '-' . $name, $class);
		}

		$anonymousComponents = [
			'form-group' => 'klementine-ui::form-group',
			'icon' => 'klementine-ui::icon',
			'dialog' => 'klementine-ui::dialog',
			'drawer' => 'klementine-ui::drawer',
		];

		foreach ($anonymousComponents as $name => $view) {
			Blade::component($view, $prefix . '-' . $name);
		}
	}

	protected function setupViews(): void
	{
		$this->loadViewsFrom(__DIR__.'/../resources/views', 'klementine-ui');
	}

	/**
	 * Returns path to package config directory
	 *
	 * @return string
	 */
	protected function getPackageConfigPath(): string
	{
		return $this->getPackageRoot().'config/';
	}

	/**
	 * Returns package root directory
	 *
	 * @return string
	 */
	protected function getPackageRoot(): string
	{
		return __DIR__.'/../../';
	}
}
