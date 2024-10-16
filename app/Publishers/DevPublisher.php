<?php

namespace App\Publishers;

class DevPublisher implements PublisherContract
{
    public function getName(): string
    {
        return 'dev.to';
    }

    public function getInputs(): array
    {
        return [
            [
                'name' => 'api-key',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Enter your dev.to api key',
                'placeholder' => 'type your api key here...',
            ],
        ];
    }
}
