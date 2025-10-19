<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            // ACTIVOS
            ['code' => '1', 'name' => 'ACTIVO', 'type' => 'activo', 'parent_id' => null],
            ['code' => '11', 'name' => 'ACTIVO CORRIENTE', 'type' => 'activo', 'parent_id' => 1],
            ['code' => '1105', 'name' => 'CAJA', 'type' => 'activo', 'parent_id' => 2],
            ['code' => '1110', 'name' => 'BANCOS', 'type' => 'activo', 'parent_id' => 2],
            ['code' => '1305', 'name' => 'CLIENTES', 'type' => 'activo', 'parent_id' => 2],
            ['code' => '1435', 'name' => 'INVENTARIO DE MERCANCÍAS', 'type' => 'activo', 'parent_id' => 2],
            
            // PASIVOS
            ['code' => '2', 'name' => 'PASIVO', 'type' => 'pasivo', 'parent_id' => null],
            ['code' => '21', 'name' => 'PASIVO CORRIENTE', 'type' => 'pasivo', 'parent_id' => 7],
            ['code' => '2205', 'name' => 'PROVEEDORES', 'type' => 'pasivo', 'parent_id' => 8],
            ['code' => '2365', 'name' => 'RETENCIÓN EN LA FUENTE', 'type' => 'pasivo', 'parent_id' => 8],
            ['code' => '2367', 'name' => 'IVA POR PAGAR', 'type' => 'pasivo', 'parent_id' => 8],
            
            // PATRIMONIO
            ['code' => '3', 'name' => 'PATRIMONIO', 'type' => 'patrimonio', 'parent_id' => null],
            ['code' => '3105', 'name' => 'CAPITAL SOCIAL', 'type' => 'patrimonio', 'parent_id' => 12],
            ['code' => '3605', 'name' => 'UTILIDAD DEL EJERCICIO', 'type' => 'patrimonio', 'parent_id' => 12],
            
            // INGRESOS
            ['code' => '4', 'name' => 'INGRESOS', 'type' => 'ingreso', 'parent_id' => null],
            ['code' => '4135', 'name' => 'COMERCIO AL POR MAYOR Y MENOR', 'type' => 'ingreso', 'parent_id' => 15],
            ['code' => '4175', 'name' => 'DEVOLUCIONES EN VENTAS', 'type' => 'ingreso', 'parent_id' => 15],
            
            // GASTOS
            ['code' => '5', 'name' => 'GASTOS', 'type' => 'gasto', 'parent_id' => null],
            ['code' => '5105', 'name' => 'GASTOS DE PERSONAL', 'type' => 'gasto', 'parent_id' => 18],
            ['code' => '5115', 'name' => 'ARRENDAMIENTOS', 'type' => 'gasto', 'parent_id' => 18],
            ['code' => '5120', 'name' => 'SERVICIOS PÚBLICOS', 'type' => 'gasto', 'parent_id' => 18],
            
            // COSTOS
            ['code' => '6', 'name' => 'COSTO DE VENTAS', 'type' => 'costo', 'parent_id' => null],
            ['code' => '6135', 'name' => 'COSTO DE MERCANCÍAS VENDIDAS', 'type' => 'costo', 'parent_id' => 22],
        ];

        foreach ($accounts as $account) {
            Account::create($account);
        }
    }
}
