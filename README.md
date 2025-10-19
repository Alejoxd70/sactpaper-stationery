# SACTPAPER - Software Contable

Sistema integral de gestión empresarial desarrollado con Laravel 12, React 19 e Inertia.js para la administración de ventas, inventario, clientes y contabilidad.

### 📊 Dashboard
- Vista general con estadísticas en tiempo real
- Ventas del día
- Facturas pendientes
- Productos con stock bajo
- Total de clientes activos

### Gestión de Ventas
- Creación y gestión de facturas
- Múltiples métodos de pago (efectivo, tarjeta, transferencia, crédito)
- Estados de pago (pendiente, parcial, pagado)
- Cálculo automático de IVA (19%)
- Descuentos aplicables
- Historial completo de ventas

### Gestión de Inventario
- CRUD completo de productos
- Control de stock en tiempo real
- Stock mínimo configurable
- Alertas de productos con stock bajo
- Seguimiento de costos y precios de venta
- Movimientos de inventario

### Gestión de Clientes
- Registro y administración de clientes
- Información de contacto completa
- Historial de compras
- Estado activo/inactivo

### Contabilidad
- Plan de cuentas jerárquico
- Registro de transacciones
- Tipos de cuenta: activo, pasivo, patrimonio, ingreso, costo, gasto
- Integración automática con ventas
- Histórico de transacciones

### Reportes
- Reportes de ventas por período
- Análisis por método de pago
- Top productos más vendidos
- Valor total de inventario
- Estado de Resultados (P&L)
  - Ingresos
  - Costos
  - Utilidad bruta
  - Gastos
  - Utilidad neta
  - Márgenes de ganancia
- Reportes personalizables por fecha

## Tecnologías

### Backend
- **Laravel 12** - Framework PHP
- **PHP 8.2+**
- **MySQL/PostgreSQL** - Base de datos
- **Laravel Fortify** - Autenticación y seguridad
- **Laravel Tinker** - REPL para debugging
- **Inertia.js** - Adaptador Laravel-React

### Frontend
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Framework de estilos
- **Vite** - Build tool y dev server
- **Radix UI** - Componentes accesibles
- **Headless UI** - Componentes React
- **Lucide React** - Iconos

### Herramientas de Desarrollo
- **PestPHP** - Testing framework
- **Laravel Pint** - Code formatter
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Code formatter
- **Concurrently** - Ejecución paralela de scripts
