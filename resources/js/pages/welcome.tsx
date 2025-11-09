import { login } from '@/routes'
import { type SharedData } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { ShoppingCart, Package, FileText, BarChart3, TrendingUp, UserCog } from 'lucide-react'

export default function Welcome() {
  const { auth } = usePage<SharedData>().props

  return (
    <>
      <Head title="Welcome">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">

        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">

          <main className="flex w-full max-w-[335px] flex-col lg:max-w-5xl">
            {/* Hero Section */}
            <div className="rounded-lg bg-white p-8 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:p-16 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
              <div className="text-center mb-12">
                <h1 className="mb-4 text-4xl font-semibold text-[#1b1b18] lg:text-5xl dark:text-[#EDEDEC]">
                  SACTPAPER
                </h1>
                <p className="mb-6 text-xl text-[#706f6c] lg:text-2xl dark:text-[#A1A09A]">
                  Sistema de gestión integral para papelerías
                </p>
                <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                  Administra inventario, ventas, facturación electrónica y contabilidad. Sistema completo con roles de usuario y control total de tu negocio.
                </p>
              </div>

              {/* CTA Buttons */}
              {!auth.user && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                  {/* <Link
                    href={register()}
                    className="inline-block rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-8 py-3 text-sm font-medium leading-normal text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d4d4d0]"
                  >
                    Registrarse
                  </Link> */}
                  <Link
                    href={login()}
                    className="inline-block rounded-sm border border-[#19140035] px-8 py-3 text-sm font-medium leading-normal text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#1f1f1e]"
                  >
                    Iniciar sesión
                  </Link>
                </div>
              )}

              {/* Features Grid */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-[#EDEDEC]/5">
                    <ShoppingCart className="h-6 w-6 text-[#1b1b18] dark:text-[#EDEDEC]" />
                  </div>
                  <h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    Punto de Venta
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                    Registra ventas rápidamente con múltiples métodos de pago: efectivo, tarjeta, transferencia y crédito.
                  </p>
                </div>

                <div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-[#EDEDEC]/5">
                    <Package className="h-6 w-6 text-[#1b1b18] dark:text-[#EDEDEC]" />
                  </div>
                  <h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    Gestión de Productos
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                    Control de inventario con alertas de stock mínimo, códigos de producto y precios personalizados.
                  </p>
                </div>

                <div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-[#EDEDEC]/5">
                    <FileText className="h-6 w-6 text-[#1b1b18] dark:text-[#EDEDEC]" />
                  </div>
                  <h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    Facturación Electrónica
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                    Genera facturas XML y PDF compatibles con formato DIAN para cumplir con requisitos fiscales.
                  </p>
                </div>

                <div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-[#EDEDEC]/5">
                    <BarChart3 className="h-6 w-6 text-[#1b1b18] dark:text-[#EDEDEC]" />
                  </div>
                  <h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    Contabilidad Integrada
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                    Plan de cuentas contable, asientos automáticos y estados financieros en tiempo real.
                  </p>
                </div>

                <div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-[#EDEDEC]/5">
                    <TrendingUp className="h-6 w-6 text-[#1b1b18] dark:text-[#EDEDEC]" />
                  </div>
                  <h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    Reportes y Análisis
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                    Visualiza ventas por período, productos más vendidos, margen de utilidad y estado de resultados.
                  </p>
                </div>

                <div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1b1b18]/5 dark:bg-[#EDEDEC]/5">
                    <UserCog className="h-6 w-6 text-[#1b1b18] dark:text-[#EDEDEC]" />
                  </div>
                  <h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    Control de Usuarios
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                    Sistema de roles: administrador, contador y cajero. Cada usuario con permisos específicos.
                  </p>
                </div>
              </div>

            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  )
}
