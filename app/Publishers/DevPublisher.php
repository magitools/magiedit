<?php

namespace App\Publishers;

use Illuminate\Support\Facades\Http;

class DevPublisher implements PublisherContract
{
    /**
     * @var array<int,mixed>
     */
    private array $values;

    private array $fm;


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

    public function setData(array $values): self
    {
        $this->values = $values;
        return $this;
    }
    /**
     * @param array<int,mixed> $fm
     */
    public function setFm(array $fm): self
    {
        $this->fm = $fm;
        return $this;
    }

    public function publish(string $content): bool
    {
        Http::post("https://dev.to/api/articles", [
            'title' => $this->fm['title'] ?? 'no title (yet...)',
            'body_markdown' => $content,
            'published' => false,
            'series' => $this->fm['series'] ?? null,
            'description' => $this->fm['description'] ?? null,
            'canonical_url' => $this->fm['canonical_url'] ?? null
        ]);
    }
}
