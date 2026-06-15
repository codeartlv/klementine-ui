<h2>Form</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-form method="post" action="/submit">...</x-ui-form>'); @endphp</pre>
	</div>

	<h3>Error response</h3>
	<x-ui-form method="post" action="{{ route('klementine-ui.form.test-error') }}">
		<x-ui-form-group>
			<x-ui-input name="name" label="Name" hint="Hint text" />
			<x-ui-input name="email" label="Email" type="email" />
			<x-ui-button type="submit" label="Submit" variant="brand" span="true" />
		</x-ui-form-group>
	</x-ui-form>
</div>
<div class="component-block__body">
	<h3>Success response</h3>
	<x-ui-form method="post" action="{{ route('klementine-ui.form.test-success') }}">
		<x-ui-form-group>
			<x-ui-input name="name" label="Name" hint="Hint text" />
			<x-ui-input name="email" label="Email" type="email" />
			<x-ui-button type="submit" label="Submit" variant="brand" span="true" />
		</x-ui-form-group>
	</x-ui-form>
</div>
