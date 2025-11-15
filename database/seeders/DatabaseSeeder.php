<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario administrador por defecto
        User::firstOrCreate(
            ['email' => 'admin@sactpaper.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Crear usuarios de ejemplo
        User::firstOrCreate(
            ['email' => 'contadora@sactpaper.com'],
            [
                'name' => 'Contadora',
                'password' => Hash::make('password'),
                'role' => 'accountant',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'cajero@sactpaper.com'],
            [
                'name' => 'Cajero',
                'password' => Hash::make('password'),
                'role' => 'cashier',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Ejecutar seeders
        $this->call([
            AccountSeeder::class,
            CustomerSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
