<?php

namespace App\Publishers;

interface PublisherContract
{
    public function getName(): string;

    public function getInputs(): array;
}
