<?php

use App\Publishers\PublisherContract;
use Spatie\StructureDiscoverer\Discover;

describe('publishers', function () {
    beforeEach(function () {
        $this->classes = Discover::in(app_path('Publishers'))->classes()->implementing(PublisherContract::class)->get();
    });

    it('publisher inputs are all valid', function () {
        foreach ($this->classes as $class) {
            $instance = new $class;
            $inputs = $instance->getInputs();
            foreach ($inputs as $input) {
                expect($input['input'])->toBeIn(config('publishers.allowed_fields'));
            }
        }
    });
});
