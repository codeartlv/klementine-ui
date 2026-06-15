@php
$options = [
	new \Codeart\Klementine\View\Components\Select\Option('1', 'Option 1'),
	new \Codeart\Klementine\View\Components\Select\Option('2', 'Option 2', true),
	new \Codeart\Klementine\View\Components\Select\Option('3', 'Option 3', false, true),
	new \Codeart\Klementine\View\Components\Select\Option('4', 'Option 4'),
	new \Codeart\Klementine\View\Components\Select\Option('5', 'Option 5'),
	new \Codeart\Klementine\View\Components\Select\Option('6', 'Option 6'),
];

$group1 = new \Codeart\Klementine\View\Components\Select\Group('0', 'Group 1');
$group1->add(new \Codeart\Klementine\View\Components\Select\Option('1', 'Option 1'));
$group1->add(new \Codeart\Klementine\View\Components\Select\Option('2', 'Option 2'));
$group1->add(new \Codeart\Klementine\View\Components\Select\Option('3', 'Option 3'));

$group2 = new \Codeart\Klementine\View\Components\Select\Group('1', 'Group 2');
$group2->add(new \Codeart\Klementine\View\Components\Select\Option('4', 'Option 4'));
$group2->add(new \Codeart\Klementine\View\Components\Select\Option('5', 'Option 5'));
$group2->add(new \Codeart\Klementine\View\Components\Select\Option('6', 'Option 6'));


$groups = [
	$group1,
	$group2,
];

@endphp
<h2>Select</h2>
<div class="component-block__body">
	<div class="base-markup">
		<pre>@php echo htmlspecialchars('<x-ui-select />'); @endphp</pre>
	</div>
</div>

<table class="component-table">
	<thead>
		<tr>
			<th></th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Basic example</td>
			<td>
				<x-ui-select label="Select label" :options="$options" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('label="Select label" :options="$options"'); @endphp</pre>
			</td>
		</tr>
		<tr>
			<td>With placeholder</td>
			<td>
				<x-ui-select label="Select label" placeholder="Select an option" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('placeholder="Select an option"'); @endphp</pre>
			</td>
		</tr>
		<tr>
			<td>With hint</td>
			<td>
				<x-ui-select label="Select label" hint="Dropdown hint example" :options="$options" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('hint="Dropdown hint example"'); @endphp</pre>
			</td>
		</tr>
		<tr>
			<td>With groups</td>
			<td>
				<x-ui-select label="Select label" :options="$groups" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars(':options="$groups"'); @endphp</pre>
			</td>
		</tr>
		<tr>
			<td>Multiple options selectable</td>
			<td>
				<x-ui-select label="Select label" :options="$options" multiple />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('multiple'); @endphp</pre>
			</td>
		</tr>
		<tr>
			<td>Prepend and append icons</td>
			<td>
				<x-ui-select label="Select label" startIcon="flag-checkered" endIcon="flag-checkered" :options="$options" />
			</td>
			<td>
				<pre>@php echo htmlspecialchars('startIcon="flag-checkered" endIcon="flag-checkered"'); @endphp</pre>
			</td>
		</tr>
	</tbody>
</table>