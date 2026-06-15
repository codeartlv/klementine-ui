<h2>Password field</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-password />'); @endphp</pre>
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
				<x-ui-password label="Password label" policy="min:6,max:20,lowercase,number,special" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('label="Password label"'); @endphp</pre>
			</td>
		</tr>
	</tbody>
</table>