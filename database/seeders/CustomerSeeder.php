<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'name' => 'María Fernanda Rodríguez',
                'document_type' => 'CC',
                'document_number' => '1053789456',
                'email' => 'mf.rodriguez@email.com',
                'phone' => '3102345678',
                'address' => 'Calle 45 #23-67, Bogotá',
                'is_active' => true,
            ],
            [
                'name' => 'Carlos Andrés Martínez',
                'document_type' => 'CC',
                'document_number' => '79456123',
                'email' => 'carlos.martinez@empresa.com',
                'phone' => '3156789012',
                'address' => 'Carrera 15 #89-34, Medellín',
                'is_active' => true,
            ],
            [
                'name' => 'Colegio San José',
                'document_type' => 'NIT',
                'document_number' => '890123456-1',
                'email' => 'compras@colegiosanjose.edu.co',
                'phone' => '6014567890',
                'address' => 'Avenida 68 #45-12, Bogotá',
                'is_active' => true,
            ],
            [
                'name' => 'Ana María Gómez',
                'document_type' => 'CC',
                'document_number' => '52345678',
                'email' => 'ana.gomez@hotmail.com',
                'phone' => '3209876543',
                'address' => 'Calle 100 #19-23, Bogotá',
                'is_active' => true,
            ],
            [
                'name' => 'Universidad del Valle',
                'document_type' => 'NIT',
                'document_number' => '890345678-2',
                'email' => 'suministros@univalle.edu.co',
                'phone' => '6022345678',
                'address' => 'Ciudad Universitaria Meléndez, Cali',
                'is_active' => true,
            ],
            [
                'name' => 'Jorge Luis Pérez',
                'document_type' => 'CC',
                'document_number' => '1098765432',
                'email' => 'jl.perez@gmail.com',
                'phone' => '3187654321',
                'address' => 'Carrera 7 #34-56, Bucaramanga',
                'is_active' => true,
            ],
            [
                'name' => 'Papelería El Estudiante SAS',
                'document_type' => 'NIT',
                'document_number' => '900456789-3',
                'email' => 'gerencia@elestudiante.com',
                'phone' => '6015678901',
                'address' => 'Calle 53 #12-34, Bogotá',
                'is_active' => true,
            ],
            [
                'name' => 'Laura Sofía Hernández',
                'document_type' => 'CC',
                'document_number' => '1001234567',
                'email' => 'laura.hernandez@outlook.com',
                'phone' => '3143456789',
                'address' => 'Carrera 50 #78-90, Barranquilla',
                'is_active' => true,
            ],
            [
                'name' => 'Empresas Públicas de Medellín',
                'document_type' => 'NIT',
                'document_number' => '890567890-4',
                'email' => 'compras@epm.com.co',
                'phone' => '6044567890',
                'address' => 'Carrera 58 #42-125, Medellín',
                'is_active' => true,
            ],
            [
                'name' => 'Diego Alejandro Torres',
                'document_type' => 'CC',
                'document_number' => '80123456',
                'email' => 'diego.torres@empresa.co',
                'phone' => '3124567890',
                'address' => 'Calle 85 #15-23, Bogotá',
                'is_active' => true,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
