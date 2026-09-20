<?php

namespace Codeart\Klementine\View\Components;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Contracts\Pagination\Paginator;
use Illuminate\View\Component;

class Pagination extends Component
{
	public function __construct(
		public mixed $paginator = null,
		public ?int $total = null,
		public ?int $page = null,
		public ?int $pageSize = null,
		public ?string $hrefTemplate = null,
		public string $appearance = 'outlined',
		public string $format = 'standard',
		public ?int $siblingCount = null,
		public ?int $boundaryCount = null,
		public bool $withEdges = false,
		public bool $withoutNav = false,
		public bool $withSummary = false,
		public bool $hideSinglePage = true,
		public bool $disabled = false,
		public ?string $label = null,
	) {
		if ($paginator instanceof Paginator) {
			$this->applyPaginator($paginator);
		}

		$this->total ??= 0;
		$this->page ??= 1;
		$this->pageSize ??= 15;
		$this->label ??= __('klementine-ui::components.pagination.label');
	}

	/**
	 * Skip output when a single page would be hidden.
	 */
	public function shouldRender(): bool
	{
		if (!$this->hideSinglePage) {
			return true;
		}

		return (int) $this->total > (int) $this->pageSize;
	}

	/**
	 * @inheritDoc
	 */
	public function render()
	{
		return view('klementine-ui::pagination');
	}

	private function applyPaginator(Paginator $paginator): void
	{
		$paginator->withQueryString();

		$this->page ??= $paginator->currentPage();
		$this->pageSize ??= $paginator->perPage();
		$this->hrefTemplate ??= $this->hrefTemplateFromPaginator($paginator);

		if ($paginator instanceof LengthAwarePaginator) {
			$this->total ??= $paginator->total();

			return;
		}

		if ($this->total !== null) {
			return;
		}

		$seen = ($paginator->currentPage() - 1) * $paginator->perPage() + count($paginator->items());
		$this->total = $paginator->hasMorePages() ? $seen + 1 : $seen;
	}

	private function hrefTemplateFromPaginator(Paginator $paginator): string
	{
		$url = $paginator->url(1);
		$pageName = method_exists($paginator, 'getPageName')
			? $paginator->getPageName()
			: 'page';
		$quoted = preg_quote($pageName, '/');
		$replaced = preg_replace('/([?&]'.$quoted.')=1(?=&|#|$)/', '$1={page}', $url, 1);

		return is_string($replaced) ? $replaced : $url;
	}
}
