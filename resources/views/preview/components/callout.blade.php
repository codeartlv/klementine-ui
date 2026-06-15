<h2>Callout</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-callout title="Callout title" message="This is a callout message." />'); @endphp</pre>
	</div>

	<div class="subcomponent">
		<table class="component-table">
			<caption>Styles</caption>
			<thead>
				<tr>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Primary</td>
					<td>
						<x-ui-callout title="Callout title" message="This is a callout message." variant="brand" />
					</td>
					<td>
						<pre>@php echo htmlspecialchars('variant="brand"'); @endphp</pre>
					</td>
				</tr>
				<tr>
					<td>Success</td>
					<td>
						<x-ui-callout title="Callout title" message="This is a callout message." variant="success" />
					</td>
					<td>
						<pre>@php echo htmlspecialchars('variant="success"'); @endphp</pre>
					</td>
				</tr>
				<tr>
					<td>Warning</td>
					<td>
						<x-ui-callout title="Callout title" message="This is a callout message." variant="warning" />
					</td>
					<td>
						<pre>@php echo htmlspecialchars('variant="warning"'); @endphp</pre>
					</td>
				</tr>
				<tr>
					<td>Neutral</td>
					<td>
						<x-ui-callout title="Callout title" message="This is a callout message." variant="neutral" />
					</td>
					<td>
						<pre>@php echo htmlspecialchars('variant="neutral"'); @endphp</pre>
					</td>
				</tr>
				<tr>
					<td>Danger</td>
					<td>
						<x-ui-callout title="Callout title" message="This is a callout message." variant="danger" />
					</td>
					<td>
						<pre>@php echo htmlspecialchars('variant="danger"'); @endphp</pre>
					</td>
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
					<td><x-ui-callout title="Callout title" message="This is a callout message." variant="warning" size="xs" /></td>
					<td><pre>@php echo htmlspecialchars('size="xs"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Small</td>
					<td><x-ui-callout title="Callout title" message="This is a callout message." variant="warning" size="s" /></td>
					<td><pre>@php echo htmlspecialchars('size="s"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Medium</td>
					<td><x-ui-callout title="Callout title" message="This is a callout message." variant="warning" size="m" /></td>
					<td><pre>@php echo htmlspecialchars('size="m"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Large</td>
					<td><x-ui-callout title="Callout title" message="This is a callout message." variant="warning" size="l" /></td>
					<td><pre>@php echo htmlspecialchars('size="l"'); @endphp</pre></td>
				</tr>
				<tr>
					<td>Extra large</td>
					<td><x-ui-callout title="Callout title" message="This is a callout message." variant="warning" size="xl" /></td>
					<td><pre>@php echo htmlspecialchars('size="xl"'); @endphp</pre></td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
