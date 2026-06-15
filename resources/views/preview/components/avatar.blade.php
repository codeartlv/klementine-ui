<h2>Avatar</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-avatar/>'); @endphp</pre>
	</div>

	<table class="component-table">
		<thead>
			<tr>
				<th>Style</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Simple avatar with image</td>
				<td>
					<x-ui-avatar image="https://images.unsplash.com/photo-1591871937573-74dbba515c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" loading="lazy"/>
				</td>
				<td>
					<pre>@php echo htmlspecialchars('image="<url>" loading="lazy"'); @endphp</pre>
				</td>
			</tr>
			<tr>
				<td>Avatar with initials</td>
				<td>
					<x-ui-avatar initials="WA"/>
				</td>
				<td>
					<pre>@php echo htmlspecialchars('initials="WA"'); @endphp</pre>
				</td>
			</tr>
		</tbody>
	</table>
</div>
