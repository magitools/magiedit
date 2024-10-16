<?php

return [
    'allowed_fields' => [
        'input',
        'select',
    ],
    'field_validation' => [
        'input' => [
            'required_values' => [
                'type',
                'label',
            ],
            'optional_values' => [
                'placeholder',
            ],
        ],
        'select' => [
            'required_values' => [

            ],
            'optional_values' => [

            ],
        ],
    ],
];
