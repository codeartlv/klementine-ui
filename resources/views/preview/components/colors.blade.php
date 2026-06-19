@php

$palettes = [
	'brand' => 'Brand',
	'neutral' => 'Neutral',
	'success' => 'Success',
	'warning' => 'Warning',
	'danger' => 'Danger',
];

$shades = ['05', '10', '20', '30', '40', '50', '60', '70', '80', '90', '95'];

@endphp

<h2>Colors</h2>
<div class="component-block__body">
	@foreach ($palettes as $slug => $title)
		<div class="wa-stack">
			<h3>{{ $title }}</h3>
			<table class="color-table">
				<thead>
					<tr>
						<th style="width: 1%">Variable</th>
						<th>Text</th>
						<th>Background</th>
						<th>Border</th>
					</tr>
				</thead>
				<tbody>
					@foreach ($shades as $shade)
						<tr>
							<td>
								<pre>--wa-color-{{ $slug }}-{{ $shade }}</pre>
							</td>
							<td>
								<div style="color:var(--wa-color-{{ $slug }}-{{ $shade }})">
									--wa-color-{{ $slug }}-{{ $shade }}
								</div>
							</td>
							<td>
								<div class="color-preview" style="background-color:var(--wa-color-{{ $slug }}-{{ $shade }})"></div>
							</td>
							<td>
								<div class="border-preview" style="border-color:var(--wa-color-{{ $slug }}-{{ $shade }})"></div>
							</td>
						</tr>
					@endforeach
				</tbody>
			</table>
		</div>
	@endforeach
</div>
