<?php

namespace Codeart\Klementine\Console;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class InstallCommand extends Command
{
	protected $signature = 'klementine-ui:install';

	protected $description = 'Install npm dependencies for Klementine UI';

	public function handle(): int
	{
		$packagePath = realpath(__DIR__ . '/../..');

		if ($packagePath === false || ! is_file($packagePath . '/package.json')) {
			$this->error('Could not find package.json in the Klementine UI package.');

			return self::FAILURE;
		}

		if (! $this->npmIsAvailable()) {
			$this->error('npm is not available. Install Node.js before running this command.');

			return self::FAILURE;
		}

		$this->info('Installing npm dependencies in ' . $packagePath);

		$process = new Process(
			['npm', 'install', '--ignore-scripts'],
			$packagePath,
		);

		$process->setTimeout(null);
		$process->run(function ($type, $buffer) {
			$this->output->write($buffer);
		});

		if (! $process->isSuccessful()) {
			$this->error('npm install failed.');

			return self::FAILURE;
		}

		$this->newLine();
		$this->info('Klementine UI npm dependencies installed successfully.');

		return self::SUCCESS;
	}

	protected function npmIsAvailable(): bool
	{
		$process = new Process(['npm', '--version']);
		$process->run();

		return $process->isSuccessful();
	}
}
