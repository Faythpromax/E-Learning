<?php

namespace App\Providers;

use App\Repositories\Interfaces\ClassRepositoryInterface;
use App\Repositories\Interfaces\TestRepositoryInterface;
use App\Repositories\ClassRepository;
use App\Repositories\TestRepository;
use App\Models\ClassUser;
use App\Models\ClassTest;
use App\Models\ClassPractice;
use App\Observers\ClassUserObserver;
use App\Observers\ClassTestObserver;
use App\Observers\ClassPracticeObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            ClassRepositoryInterface::class,
            ClassRepository::class
        );

        $this->app->bind(
            TestRepositoryInterface::class,
            TestRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ClassUser::observe(ClassUserObserver::class);
        ClassTest::observe(ClassTestObserver::class);
        ClassPractice::observe(ClassPracticeObserver::class);
    }
}
