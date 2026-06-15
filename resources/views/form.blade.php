<form x-data="form" method="{{ $method }}" {{ $attributes->merge(['class' => '']) }}>
	@csrf

	{{ $slot }}
</form>