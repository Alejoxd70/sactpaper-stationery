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
        // Limpiar cuentas existentes para evitar duplicados
        Account::query()->delete();

        // Nivel 1 - Cuentas principales
        $activo = Account::create(['code' => '1', 'name' => 'ACTIVO', 'type' => 'activo', 'parent_id' => null]);
        $pasivo = Account::create(['code' => '2', 'name' => 'PASIVO', 'type' => 'pasivo', 'parent_id' => null]);
        $patrimonio = Account::create(['code' => '3', 'name' => 'PATRIMONIO', 'type' => 'patrimonio', 'parent_id' => null]);
        $ingresos = Account::create(['code' => '4', 'name' => 'INGRESOS', 'type' => 'ingreso', 'parent_id' => null]);
        $gastos = Account::create(['code' => '5', 'name' => 'GASTOS', 'type' => 'gasto', 'parent_id' => null]);
        $costos = Account::create(['code' => '6', 'name' => 'COSTO DE VENTAS', 'type' => 'costo', 'parent_id' => null]);

        // Nivel 2 - Subcuentas
        $activoCorriente = Account::create(['code' => '11', 'name' => 'ACTIVO CORRIENTE', 'type' => 'activo', 'parent_id' => $activo->id]);
        $pasivoCorriente = Account::create(['code' => '21', 'name' => 'PASIVO CORRIENTE', 'type' => 'pasivo', 'parent_id' => $pasivo->id]);

        // Nivel 3 - Cuentas de activo
        Account::create(['code' => '1105', 'name' => 'CAJA', 'type' => 'activo', 'parent_id' => $activoCorriente->id]);
        Account::create(['code' => '1110', 'name' => 'BANCOS', 'type' => 'activo', 'parent_id' => $activoCorriente->id]);
        Account::create(['code' => '1305', 'name' => 'CLIENTES', 'type' => 'activo', 'parent_id' => $activoCorriente->id]);
        Account::create(['code' => '1435', 'name' => 'INVENTARIO DE MERCANCÍAS', 'type' => 'activo', 'parent_id' => $activoCorriente->id]);

        // Nivel 3 - Cuentas de pasivo
        Account::create(['code' => '2205', 'name' => 'PROVEEDORES', 'type' => 'pasivo', 'parent_id' => $pasivoCorriente->id]);
        Account::create(['code' => '2365', 'name' => 'RETENCIÓN EN LA FUENTE', 'type' => 'pasivo', 'parent_id' => $pasivoCorriente->id]);
        Account::create(['code' => '2367', 'name' => 'IVA POR PAGAR', 'type' => 'pasivo', 'parent_id' => $pasivoCorriente->id]);

        // Nivel 3 - Cuentas de patrimonio
        Account::create(['code' => '3105', 'name' => 'CAPITAL SOCIAL', 'type' => 'patrimonio', 'parent_id' => $patrimonio->id]);
        Account::create(['code' => '3605', 'name' => 'UTILIDAD DEL EJERCICIO', 'type' => 'patrimonio', 'parent_id' => $patrimonio->id]);

        // Nivel 3 - Cuentas de ingresos
        Account::create(['code' => '4135', 'name' => 'COMERCIO AL POR MAYOR Y MENOR', 'type' => 'ingreso', 'parent_id' => $ingresos->id]);
        Account::create(['code' => '4175', 'name' => 'DEVOLUCIONES EN VENTAS', 'type' => 'ingreso', 'parent_id' => $ingresos->id]);

        // Nivel 3 - Cuentas de gastos
        Account::create(['code' => '5105', 'name' => 'GASTOS DE PERSONAL', 'type' => 'gasto', 'parent_id' => $gastos->id]);
        Account::create(['code' => '5115', 'name' => 'ARRENDAMIENTOS', 'type' => 'gasto', 'parent_id' => $gastos->id]);
        Account::create(['code' => '5120', 'name' => 'SERVICIOS PÚBLICOS', 'type' => 'gasto', 'parent_id' => $gastos->id]);

        // Nivel 3 - Cuentas de costos
        Account::create(['code' => '6135', 'name' => 'COSTO DE MERCANCÍAS VENDIDAS', 'type' => 'costo', 'parent_id' => $costos->id]);
    }
}
