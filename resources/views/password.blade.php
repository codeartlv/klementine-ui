@php
$rules = explode(',', $policy);
$mapped = [];

foreach ($rules as $rule) {
    $parts = explode(':', $rule);
    $rule_name = $parts[0];
    $rule_value = $parts[1] ?? true;

    $mapped[$rule_name] = $rule_value;
}

$min_length = $mapped['min'] ?? 0;
@endphp

<div class="password-validator" x-data="passwordField('{{$policy}}')" :class="{ 'has-policy': hasPolicy, 'revealed': isRevealed, 'long-password': isLong }">
	<wa-input {{$attributes}} :type="type" x-model="password" label="{{ $label }}" name="{{ $name }}" value="{{ $value }}" >
        <div slot="end">
            <a href="javascript:;" @click="toggleVisibility()" class="password-validator__toggle-visibility">
                <span>
                    <x-ui-icon name="eye" />
                </span>
                <span>
                    <x-ui-icon name="eye-slash" />
                </span>
            </a>
        </div>
    </wa-input>

    <div data-field-message="{{$name}}"></div>

    <div class="password-validator__progress" :class="{ 'is_filled': progress > 0 }">
        <div data-role="password-validator.progress" :style="`width: ${progress}%`" :class="progressClass"></div>
    </div>
	
    <div data-role="form.field-message" data-name="password"></div>

    <ul class="password-validator__steps">
        <li :class="{ 'requires': policyRules.mixed, 'complete': state.mixed }">
            <x-ui-icon name="check" />
            @lang('klementine-ui::components.password_field.password_hint.mixed')
        </li>
        <li :class="{ 'requires': policyRules.uppercase, 'complete': state.uppercase }">
            <x-ui-icon name="check" />
            @lang('klementine-ui::components.password_field.password_hint.uppercase')
        </li>
        <li :class="{ 'requires': policyRules.lowercase, 'complete': state.lowercase }">
            <x-ui-icon name="check" />
            @lang('klementine-ui::components.password_field.password_hint.lowercase')
        </li>
        <li :class="{ 'requires': policyRules.special, 'complete': state.special }">
            <x-ui-icon name="check" />
            @lang('klementine-ui::components.password_field.password_hint.symbols')
        </li>
        <li :class="{ 'requires': policyRules.number, 'complete': state.number }">
            <x-ui-icon name="check" />
            @lang('klementine-ui::components.password_field.password_hint.numbers')
        </li>
        <li :class="{ 'requires': policyRules.min, 'complete': state.min }">
            <x-ui-icon name="check" />
            @lang('klementine-ui::components.password_field.password_hint.length', ['length' => $min_length])
        </li>
        <li data-role="long-password" :class="{ 'requires': policyRules.max, 'complete': state.max }">
            <x-ui-icon name="check"/>
            @lang('klementine-ui::components.password_field.password_hint.long')
        </li>
    </ul>
</div>