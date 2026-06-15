<x-ui-form method="post"  action="{{route('klementine-ui.form.test-error')}}">
	<x-ui-form-group>
		<x-ui-input name="name" label="Name" hint="Hint text" />
		<x-ui-input name="email" label="Email" type="email" />
		<x-ui-button type="submit" label="Submit" variant="brand" span="true" />
	</x-ui-form-group>
</x-ui-form>