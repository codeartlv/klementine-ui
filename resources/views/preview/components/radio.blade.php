<h2>Radio</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-radio name="radio" label="Radio label" value="1" />'); @endphp</pre>
	</div>

	<p>
		<x-ui-radio name="radio" :label="'Radio label'" value="1" />
	</p>
	<p>
		<x-ui-radio name="radio" label="Radio with hint" hint="This is a hint" value="1" />
	</p>
	<p>
		<x-ui-radio name="radio" disabled label="Disabled radio" value="1" />
	</p>
</div>
