<h2>Datepicker</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-datepicker />'); @endphp</pre>
	</div>
</div>

<table class="component-table">
	<thead>
		<tr>
			<th>Style</th>
			<th>Preview</th>
			<th>Attributes</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Basic example</td>
			<td>
				<x-ui-datepicker label="Datepicker label" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('label="Datepicker label"'); @endphp</pre>
			</td>
		</tr>
		<tr>
			<td>No future dates</td>
			<td>
				<x-ui-datepicker label="Datepicker label" max="today" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('max="today"'); @endphp</pre>
			</td>
		</tr>
	</tbody>
</table>