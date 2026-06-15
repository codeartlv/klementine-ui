<div x-data="datepicker('{{ $value?->format('Y-m-d') ?? '' }}', { displayFormat: '{{ $displayFormat }}' })" class="w-full max-w-xs">
    <input type="hidden" name="{{$name}}" :value="hiddenDate" />

    <wa-input x-ref="waInput" {{$attributes}} clearable @wa-clear="clearDate()">
        <wa-icon slot="start" name="calendar"></wa-icon>
    </wa-input>
</div>