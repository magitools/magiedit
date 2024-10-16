<?php

namespace App\Publishers;

interface PublisherContract
{
    public function getName(): string;
    /**
     * @return void
     */
    public function getInputs(): array;
    /**
     * @param array<int,mixed> $values
     */
    public function setData(array $values): self;
    /**
     * @param array<int,mixed> $fm
     */
    public function setFm(array $fm): self;

    public function publish(string $content): bool;
}
