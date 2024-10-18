<?php

namespace App\Publishers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
     * @param  array<int,mixed>  $fm
     */
    public function setFm(array $fm): self
    {
        $this->fm = $fm;

        return $this;
    }

    /**
     * @throws ConnectionException
     */
    public function publish(string $content): bool
    {
        $res = Http::withHeaders([
            'api-key' => $this->values['api-key'],
        ])->post('https://dev.to/api/articles', [
            'article' => [
                'title' => $this->fm['title'] ?? 'no title (yet...)',
                'body_markdown' => $content,
                'published' => false,
                'series' => $this->fm['series'] ?? null,
                'description' => $this->fm['description'] ?? null,
                'canonical_url' => $this->fm['canonical_url'] ?? null,
            ],
        ]);
        if (! $res->created()) {
            Log::error($res->body());
            Log::error($res->reason());
        }

        return $res->created();
    }
}
