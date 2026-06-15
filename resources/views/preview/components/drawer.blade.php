<h2>Drawer</h2>
<div class="component-block__body">
	<div class="base-markup">
		<h5>On inline elements</h5>
		<pre>@php echo htmlspecialchars('x-data="drawer(\'<url>\', \'Caption\', \'optional-id\')"'); @endphp</pre>
	</div>

	<div class="base-markup">
		<h5>As JavaScript</h5>
		<pre>import Drawer from '@klementine-ui/js/ui-components/drawer.js';

const drawer = new Drawer({ id: 'my-drawer', caption: 'Caption' });
drawer.open('/your-endpoint', { placement: 'end' }).then((drawerEl) => {
	// Drawer is open
});</pre>
	</div>

	<p>
		<a href="javascript:;" x-data="drawer('{{ route('klementine-ui.dialog.test-success') }}', 'Caption')">Open drawer from URL</a>
	</p>
</div>
