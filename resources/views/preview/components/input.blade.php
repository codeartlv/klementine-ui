<h2>Input</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-input name="name" label="Name" hint="Hint text" />'); @endphp</pre>
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
					<x-ui-input name="name" label="Name" hint="Hint text" />
				</td>
				<td>
					<pre>@php echo htmlspecialchars('name="name" label="Name" hint="Hint text"'); @endphp</pre>
				</td>
			</tr>
			<tr>
				<td>Email</td>
				<td>
					<x-ui-input name="email" label="Email" type="email" />
				</td>
				<td>
					<pre>@php echo htmlspecialchars('type="email"'); @endphp</pre>
				</td>
			</tr>
			<tr>
				<td>Required</td>
				<td>
					<x-ui-input name="required" label="Required field" required />
				</td>
				<td>
					<pre>@php echo htmlspecialchars('required'); @endphp</pre>
				</td>
			</tr>
		</tbody>
	</table>
</div>
