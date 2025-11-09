# SACTPAPER - Sistema de Gestión Contable para Papelería

Sistema integral de gestión desarrollado con Laravel 12, React 19 e Inertia.js para la administración completa de papelerías. Control de ventas, inventario de productos de papelería, clientes, contabilidad y reportes empresariales.

### Dashboard
- Vista general con estadísticas en tiempo real
- Ventas del día
- Facturas pendientes
- Productos con stock bajo
- Total de clientes activos

### Gestión de Ventas
- Creación y gestión de facturas con generación de PDF
- Múltiples métodos de pago (efectivo, tarjeta, transferencia, crédito)
- Estados de pago (pendiente, parcial, pagado)
- Cálculo automático de IVA (19%)
- Descuentos aplicables
- Historial completo de ventas con filtros
- Impresión y descarga de facturas

### Gestión de Inventario
- CRUD completo de productos de papelería
- Control de stock en tiempo real
- Stock mínimo configurable con alertas automáticas
- Alertas de productos con stock bajo
- Categorización de productos (escritura, cuadernos, papel, archivo, herramientas, adhesivos, arte)
- Seguimiento de costos y precios de venta
- Movimientos de inventario detallados
- Códigos únicos por producto

### Gestión de Clientes
- Registro y administración de clientes (personas y empresas)
- Tipos de documento (CC, NIT)
- Información de contacto completa (email, teléfono, dirección)
- Historial de compras por cliente
- Total de compras y saldo pendiente
- Estado activo/inactivo

### Gestión de Usuarios
- Sistema de roles (Administrador, Contador, Cajero)
- Control de acceso basado en permisos
- Estado activo/inactivo de usuarios
- Autenticación segura con Laravel Fortify
- Gestión completa de usuarios por administradores

### Contabilidad
- Plan de cuentas jerárquico
- Registro de transacciones contables
- Tipos de cuenta: activo, pasivo, patrimonio, ingreso, costo, gasto
- Integración automática con ventas
- Histórico completo de transacciones
- Balance general y estados financieros

### Reportes
- **Reporte general** con vista y exportación a PDF
- Reportes de ventas por período personalizable
- Análisis detallado por método de pago con gráficos
- Top 5 productos más vendidos
- Valor total de inventario
- Productos con stock bajo
- Cuentas por cobrar (pendientes de pago)
- **Estado de Resultados (P&L)**
  - Ingresos del período
  - Costos de ventas
  - Utilidad bruta
  - Gastos operativos
  - Utilidad neta
  - Márgenes de ganancia porcentuales
- Filtros de fecha con validación
- Diseño responsive para móviles y tablets
- Vista previa de PDFs en navegador

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
- **Tailwind CSS 4** - Framework de estilos con modo oscuro
- **Vite** - Build tool y dev server
- **Radix UI** - Componentes accesibles
- **Headless UI** - Componentes React
- **Lucide React** - Sistema de iconos
- **DomPDF** - Generación de PDFs

### Herramientas de Desarrollo
- **PestPHP** - Testing framework
- **Laravel Pint** - Code formatter
- **ESLint** - Linter JavaScript/TypeScript
- **Prettier** - Code formatter
- **Concurrently** - Ejecución paralela de scripts
