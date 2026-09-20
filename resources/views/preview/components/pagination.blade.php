<h2>Pagination</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-pagination :paginator="$paginator" with-summary />'); @endphp</pre>
	</div>

	@php
		use Illuminate\Pagination\LengthAwarePaginator;

		$paginator = new LengthAwarePaginator(
			items: [],
			total: 237,
			perPage: 10,
			currentPage: LengthAwarePaginator::resolveCurrentPage(),
			options: [
				'path' => LengthAwarePaginator::resolveCurrentPath(),
				'pageName' => 'page',
			],
		);
	@endphp

	<div class="subcomponent">
		<h3>Laravel paginator</h3>
		<x-ui-pagination :paginator="$paginator" with-summary with-edges />
	</div>

	<div class="subcomponent">
		<h3>Manual totals</h3>
		<x-ui-pagination :total="237" :page="3" :page-size="10" href-template="?page={page}" />
	</div>

	<div class="subcomponent">
		<h3>Compact</h3>
		<x-ui-pagination :total="237" :page="1" :page-size="10" format="compact" with-summary href-template="?page={page}" />
	</div>

	<div class="subcomponent">
		<table class="component-table">
			<caption>Appearance</caption>
			<tbody>
				<tr>
					<td>Outlined</td>
					<td><x-ui-pagination :total="80" :page="2" :page-size="10" appearance="outlined" href-template="?page={page}" /></td>
				</tr>
				<tr>
					<td>Filled</td>
					<td><x-ui-pagination :total="80" :page="2" :page-size="10" appearance="filled" href-template="?page={page}" /></td>
				</tr>
				<tr>
					<td>Plain</td>
					<td><x-ui-pagination :total="80" :page="2" :page-size="10" appearance="plain" href-template="?page={page}" /></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
