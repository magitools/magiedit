<?php

namespace App\Providers;

use AaronFrancis\Solo\Commands\EnhancedTailCommand;
use AaronFrancis\Solo\Facades\Solo;
use AaronFrancis\Solo\Providers\SoloApplicationServiceProvider;

class SoloServiceProvider extends SoloApplicationServiceProvider
{
    public function register()
    {
        Solo::useTheme('dark')
            // Commands that auto start.
            ->addCommands([
                'Logs' => 'php artisan pail',
                'Vite' => 'pnpm dev',
                'HTTP' => 'php artisan serve',
            ])
            // Not auto-started
            ->addLazyCommands([
                'Queue' => 'php artisan queue:listen --tries=1',
                'VitePress' => 'pnpm run docs:dev'
                // 'Reverb' => 'php artisan reverb:start',
                // 'Pint' => 'pint --ansi',
            ])
            // FQCNs of trusted classes that can add commands.
            ->allowCommandsAddedFrom([
                //
            ]);
    }

    public function boot()
    {
        //
    }
}
