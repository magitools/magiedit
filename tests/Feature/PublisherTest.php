<?php

use App\Publishers\PublisherContract;
use Spatie\StructureDiscoverer\Discover;

describe('publishers', function () {
    beforeEach(function () {
        $this->classes = Discover::in(app_path('Publishers'))->classes()->implementing(PublisherContract::class)->get();
    });

    arch()
        ->expect('App\Publishers')
        ->toBeClasses()
        ->ignoring('App\Publishers\PublisherContract');

    it('publisher inputs are allowed', function () {
        foreach ($this->classes as $class) {
            $instance = new $class;
            $inputs = $instance->getInputs();
            foreach ($inputs as $input) {
                $validationRules = config('publishers.field_validation');
                expect($input['input'])->toBeIn(config('publishers.allowed_fields'));
                expect($input)->toHaveKeys($validationRules[$input['input']]['required_values']);
            }
        }
    });
    it('publisher inputs have all required options', function () {
        foreach ($this->classes as $class) {
            $instance = new $class;
            $inputs = $instance->getInputs();
            foreach ($inputs as $input) {
                $validationRules = config('publishers.field_validation');
                expect($input)->toHaveKeys($validationRules[$input['input']]['required_values']);
            }
        }
    });
});
