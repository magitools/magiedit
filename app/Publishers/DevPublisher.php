<?php

namespace App\Publishers;

class DevPublisher implements PublisherContract
{
    public function getName(): string
    {
        return "dev.to";
    }
}
