<h2>Dialog</h2>
<div class="component-block__body">
	<div class="base-markup">
		<h5>On inline elements</h5>
		<pre>@php echo htmlspecialchars('x-data="dialog(\'<url>\', \'Caption\', \'optional-id\')"'); @endphp</pre>
	</div>

	<div class="base-markup">
		<h5>As JavaScript</h5>
		<pre>import Dialog from '@klementine-ui/js/ui-components/dialog.js';

const dialog = new Dialog({ id: 'my-dialog', caption: 'Caption' });
dialog.open('/your-endpoint').then((dialogEl) => {
	// Dialog is open
});</pre>
	</div>

	<p>
		<a href="javascript:;" x-data="dialog('{{ route('klementine-ui.dialog.test-success') }}', 'Caption')">Open dialog from URL</a>
		<a href="javascript:;" x-data="dialog(document.getElementById('mobile-nav'), 'Caption')">Open dialog from element</a>
	</p>

	<x-ui-dialog id="mobile-nav" label="Dialog">
		<p>This is a standard dialog. You can put any content you want in here!</p>
		<div slot="footer">
			<x-ui-button appearance="filled" variant="brand" data-dialog="close" label="Close" />
		</div>
	</x-ui-dialog>
</div>
