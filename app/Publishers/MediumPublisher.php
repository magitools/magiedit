<?php

namespace App\Publishers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MediumPublisher implements PublisherContract
{
    /**
     * @var array<int,mixed>
     */
    private array $values;

    /**
     * @var array<int,mixed>
     */
    private array $fm;


    public function getName(): string
    {
        return "medium";
    }

    public function getInputs(): array
    {
        return [
            [
                'name' => 'token',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Medium Token',
                'placeholder' => 'write your medium token here...'
            ],
        ];
    }

    public function setData(array $values): self
    {
        $this->values = $values;
        return $this;
    }

    public function setFm(array $fm): self
    {
        $this->fm = $fm;
        return $this;
    }

    public function publish(string $content): bool
    {
        $userRes = Http::withHeaders([
            "authorization" => "Bearer {$this->values['token']}"
        ])->get("https://api.medium.com/v1/me/");
        $userBody = $userRes->json();
        $userId = $userBody['data']['id'];

        $postRes = Http::withHeaders([
            "authorization" => "Bearer {$this->values['token']}"
        ])->post("https://api.medium.com/v1/users/$userId/posts", [
                "title" => $this->fm['title'],
                "contentFormat" => "markdown",
                "content" => $content,
                "publishStatus" => "draft"
            ]);
        Log::info($postRes->json());
        return $postRes->status() == 201;
    }

}
