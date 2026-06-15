<h2>Badge</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-badge label="Badge label" variant="primary" />'); @endphp</pre>
	</div>

	<table class="component-table">
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
				<td><x-ui-badge label="Primary badge" variant="primary" /></td>
				<td><x-ui-badge label="Success badge" variant="success" /></td>
				<td><x-ui-badge label="Neutral badge" variant="neutral" /></td>
				<td><x-ui-badge label="Warning badge" variant="warning" /></td>
				<td><x-ui-badge label="Danger badge" variant="danger" /></td>
				<td><pre>@php echo htmlspecialchars('variant="<variant>"'); @endphp</pre></td>
			</tr>
			<tr>
				<td>Outline filled</td>
				<td><x-ui-badge label="Primary badge" variant="primary" appearance="filled-outlined" /></td>
				<td><x-ui-badge label="Success badge" variant="success" appearance="filled-outlined" /></td>
				<td><x-ui-badge label="Neutral badge" variant="neutral" appearance="filled-outlined" /></td>
				<td><x-ui-badge label="Warning badge" variant="warning" appearance="filled-outlined" /></td>
				<td><x-ui-badge label="Danger badge" variant="danger" appearance="filled-outlined" /></td>
				<td><pre>@php echo htmlspecialchars('appearance="filled-outlined"'); @endphp</pre></td>
			</tr>
			<tr>
				<td>Filled</td>
				<td><x-ui-badge label="Primary badge" variant="primary" appearance="filled" /></td>
				<td><x-ui-badge label="Success badge" variant="success" appearance="filled" /></td>
				<td><x-ui-badge label="Neutral badge" variant="neutral" appearance="filled" /></td>
				<td><x-ui-badge label="Warning badge" variant="warning" appearance="filled" /></td>
				<td><x-ui-badge label="Danger badge" variant="danger" appearance="filled" /></td>
				<td><pre>@php echo htmlspecialchars('appearance="filled"'); @endphp</pre></td>
			</tr>
			<tr>
				<td>Outlined</td>
				<td><x-ui-badge label="Primary badge" variant="primary" appearance="outlined" /></td>
				<td><x-ui-badge label="Success badge" variant="success" appearance="outlined" /></td>
				<td><x-ui-badge label="Neutral badge" variant="neutral" appearance="outlined" /></td>
				<td><x-ui-badge label="Warning badge" variant="warning" appearance="outlined" /></td>
				<td><x-ui-badge label="Danger badge" variant="danger" appearance="outlined" /></td>
				<td><pre>@php echo htmlspecialchars('appearance="outlined"'); @endphp</pre></td>
			</tr>
			<tr>
				<td>Pills</td>
				<td><x-ui-badge label="Primary badge" variant="primary" appearance="outlined" pill /></td>
				<td><x-ui-badge label="Success badge" variant="success" appearance="outlined" pill /></td>
				<td><x-ui-badge label="Neutral badge" variant="neutral" appearance="outlined" pill /></td>
				<td><x-ui-badge label="Warning badge" variant="warning" appearance="outlined" pill/></td>
				<td><x-ui-badge label="Danger badge" variant="danger" appearance="outlined" pill/></td>
				<td><pre>@php echo htmlspecialchars('pill'); @endphp</pre></td>
			</tr>
			<tr>
				<td>Pulse</td>
				<td><x-ui-badge label="1" variant="primary" attention="pulse" pill/></td>
				<td><x-ui-badge label="2" variant="success" attention="pulse" pill/></td>
				<td><x-ui-badge label="3" variant="neutral" attention="pulse" pill /></td>
				<td><x-ui-badge label="4" variant="warning" attention="pulse" pill /></td>
				<td><x-ui-badge label="9+" variant="danger" attention="pulse" pill/></td>
				<td><pre>@php echo htmlspecialchars('attention="pulse"'); @endphp</pre></td>
			</tr>
		</tbody>
	</table>
</div>
