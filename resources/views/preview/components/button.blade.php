<h2>Buttons</h2>
<div class="component-block__body">
	<div class="subcomponent">
		<div class="base-markup">
			<pre>@php echo htmlspecialchars('<x-ui-button label="Button label" />'); @endphp</pre>
		</div>

		<table class="component-table">
			<caption>Styles</caption>
			<thead>
				<tr>
					<th>Style</th>
					<th>Primary</th>
					<th>Success</th>
					<th>Neutral</th>
					<th>Warning</th>
					<th>Danger</th>
					<th>Attribute</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Normal</td>
					<td><x-ui-button appearance="accent" variant="brand" label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="success" label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="neutral" label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="warning" label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="danger" label="Button" /></td>
					<td></td>
				</tr>
				<tr>
					<td>Filled</td>
					<td><x-ui-button appearance="filled" variant="brand" label="Button" /></td>
					<td><x-ui-button appearance="filled" variant="success" label="Button" /></td>
					<td><x-ui-button appearance="filled" variant="neutral" label="Button" /></td>
					<td><x-ui-button appearance="filled" variant="warning" label="Button" /></td>
					<td><x-ui-button appearance="filled" variant="danger" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('appearance="filled"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Filled outlined</td>
					<td><x-ui-button appearance="filled-outlined" variant="brand" label="Button" /></td>
					<td><x-ui-button appearance="filled-outlined" variant="success" label="Button" /></td>
					<td><x-ui-button appearance="filled-outlined" variant="neutral" label="Button" /></td>
					<td><x-ui-button appearance="filled-outlined" variant="warning" label="Button" /></td>
					<td><x-ui-button appearance="filled-outlined" variant="danger" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('appearance="filled-outlined"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Outlined</td>
					<td><x-ui-button appearance="outlined" variant="brand" label="Button" /></td>
					<td><x-ui-button appearance="outlined" variant="success" label="Button" /></td>
					<td><x-ui-button appearance="outlined" variant="neutral" label="Button" /></td>
					<td><x-ui-button appearance="outlined" variant="warning" label="Button" /></td>
					<td><x-ui-button appearance="outlined" variant="danger" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('appearance="outlined"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Plain</td>
					<td><x-ui-button appearance="plain" variant="brand" label="Button" /></td>
					<td><x-ui-button appearance="plain" variant="success" label="Button" /></td>
					<td><x-ui-button appearance="plain" variant="neutral" label="Button" /></td>
					<td><x-ui-button appearance="plain" variant="warning" label="Button" /></td>
					<td><x-ui-button appearance="plain" variant="danger" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('appearance="plain"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Disabled</td>
					<td><x-ui-button appearance="accent" variant="brand" disabled label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="success" disabled label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="neutral" disabled label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="warning" disabled label="Button" /></td>
					<td><x-ui-button appearance="accent" variant="danger" disabled label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('disabled'); @endphp</pre></td>
				</tr>
			</tbody>
		</table>
	</div>

	<div class="subcomponent">
		<table class="component-table">
			<caption>Sizes</caption>
			<thead>
				<tr>
					<th>Size</th>
					<th>Preview</th>
					<th>Attribute</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Extra small</td>
					<td><x-ui-button appearance="accent" variant="brand" size="xs" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('size="xs"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Small</td>
					<td><x-ui-button appearance="accent" variant="brand" size="s" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('size="s"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Medium</td>
					<td><x-ui-button appearance="accent" variant="brand" size="m" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('size="m"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Large</td>
					<td><x-ui-button appearance="accent" variant="brand" size="l" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('size="l"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Extra large</td>
					<td><x-ui-button appearance="accent" variant="brand" size="xl" label="Button" /></td>
					<td><pre>@php echo htmlspecialchars('size="xl"'); @endphp</pre></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
