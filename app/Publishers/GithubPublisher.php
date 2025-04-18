<?php

namespace App\Publishers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GithubPublisher implements PublisherContract
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
        return "github";
    }

    public function getInputs(): array
    {
        return [
            [
                'name' => 'gh_token',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Github API Token',
                'placeholder' => 'Github API Token here...'
            ],
            [
                'name' => 'gh_user',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Github Username or Organization name',
                'placeholder' => 'Write here...'
            ],
            [
                'name' => 'gh_repo',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Repository Name',
                'placeholder' => 'Repository name here...'
            ],
            [
                'name' => 'gh_folder',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Repository folder relative to the root of the repository',
                'placeholder' => 'Folder name here...'
            ],
            [
                'name' => 'gh_commit',
                'input' => 'input',
                'type' => 'text',
                'label' => 'Commit message for file creation: use frontmatter variables by using %variable_name%',
                'placeholder' => 'Commit message here...'
            ]
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

    protected function getCommitMessage(): string
    {
        $res = preg_replace_callback('/%(\w+)%/', function($matches) {
                $key = $matches[1];
                return isset($this->fm[$key]) ? $this->fm[$key] : $matches[0];
        }, $this->values['gh_commit']);
        return $res;
    }

    public function publish(string $content): bool
    {
        $title = strtolower($this->fm['title']);
        $title = preg_replace('/[^a-z0-9\s-]/', '', $title);
        $title = preg_replace('/[\s-]+/', '-', $title);
        $title = trim($title, '-');
        $commit = $this->getCommitMessage();
        $fileRes = Http::withHeaders([
            'authorization' => "Bearer {$this->values['gh_token']}" ,
            'accept' => 'application/vnd.github+json',
            'content-type' => 'application/json',
			'X-GitHub-Api-Version' => '2022-11-28'
        ])->get("https://api.github.com/repos/{$this->values['gh_user']}/{$this->values['gh_repo']}/contents/{$this->values['gh_folder']}/$title.md");
        $sha = $fileRes->status() == 200 ? $fileRes->json()['sha'] : null;
        $res = Http::withHeaders([
            'authorization' => "Bearer {$this->values['gh_token']}" ,
            'accept' => 'application/vnd.github+json',
			'content-type' => 'application/json',
			'X-GitHub-Api-Version' => '2022-11-28'
        ])->put("https://api.github.com/repos/{$this->values['gh_user']}/{$this->values['gh_repo']}/contents/{$this->values['gh_folder']}/$title.md", [
                'message' => $commit,
                'content' => base64_encode($content),
                'sha' => $sha
            ]);
        Log::info($res->json());
        return $res->status() < 300;
    }
}












