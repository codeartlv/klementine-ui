<h2>Checkbox</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-checkbox name="checkbox" label="Checkbox label" value="1" />'); @endphp</pre>
	</div>

	<p>
		<x-ui-checkbox name="checkbox" :label="'Checkbox label'" value="1" />
	</p>
	<p>
		<x-ui-checkbox name="checkbox" label="Checkbox with hint" hint="This is a hint" value="1" />
	</p>
	<p>
		<x-ui-checkbox name="checkbox" disabled label="Disabled checkbox" value="1" />
	</p>
</div>
