import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
	const { auth } = usePage<SharedData>().props;

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
				<header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
					<nav className="flex items-center justify-end gap-4">
						{auth.user ? (
							<Link
								href={dashboard()}
								className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
							>
								Dashboard
							</Link>
						) : (
							<>
								<Link
									href={login()}
									className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
								>
									Inciar sesión
								</Link>
								<Link
									href={register()}
									className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
								>
									Registrarse
								</Link>
							</>
						)}
					</nav>
				</header>

				<div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">

					<main className="flex w-full max-w-[335px] flex-col lg:max-w-5xl">
						{/* Hero Section */}
						<div className="rounded-lg bg-white p-8 pb-12 shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:p-16 dark:bg-[#161615] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
							<div className="text-center mb-12">
								<h1 className="mb-4 text-4xl font-semibold text-[#1b1b18] lg:text-5xl dark:text-[#EDEDEC]">
									PAPERSACT
								</h1>
								<p className="mb-6 text-xl text-[#706f6c] lg:text-2xl dark:text-[#A1A09A]">
									Gestión contable inteligente para tu papelería
								</p>
								<p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
									Controla inventario, ventas y finanzas en tiempo real. Diseñado específicamente para papelerías que buscan eficiencia y crecimiento.
								</p>
							</div>

							{/* CTA Buttons */}
							<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
								<Link
									href={register()}
									className="inline-block rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-8 py-3 text-sm font-medium leading-normal text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d4d4d0]"
								>
									Registrarse
								</Link>
								<Link
									href={login()}
									className="inline-block rounded-sm border border-[#19140035] px-8 py-3 text-sm font-medium leading-normal text-[#1b1b18] hover:border-[#1915014a] hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] dark:hover:bg-[#1f1f1e]"
								>
									Iniciar sesión
								</Link>
							</div>

							{/* Features Grid */}
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								<div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
									<div className="mb-3 text-2xl">📊</div>
									<h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
										Control de Inventario
									</h3>
									<p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
										Seguimiento en tiempo real de productos, alertas de stock bajo y gestión de proveedores.
									</p>
								</div>

								<div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
									<div className="mb-3 text-2xl">💰</div>
									<h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
										Facturación Rápida
									</h3>
									<p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
										Genera facturas profesionales en segundos. Compatible con tickets y comprobantes fiscales.
									</p>
								</div>

								<div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
									<div className="mb-3 text-2xl">📈</div>
									<h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
										Reportes Detallados
									</h3>
									<p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
										Analiza ventas, ganancias y tendencias con reportes visuales y exportables.
									</p>
								</div>

								<div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
									<div className="mb-3 text-2xl">🔄</div>
									<h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
										Sincronización Cloud
									</h3>
									<p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
										Accede a tus datos desde cualquier dispositivo. Tu información siempre segura.
									</p>
								</div>

								<div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
									<div className="mb-3 text-2xl">👥</div>
									<h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
										Gestión de Clientes
									</h3>
									<p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
										Administra clientes, historial de compras y cuentas por cobrar de manera eficiente.
									</p>
								</div>

								<div className="rounded-sm border border-[#19140035] p-6 dark:border-[#3E3E3A]">
									<div className="mb-3 text-2xl">⚡</div>
									<h3 className="mb-2 text-base font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
										Interfaz Intuitiva
									</h3>
									<p className="text-[13px] leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
										Diseño simple y rápido de usar. Sin curvas de aprendizaje complicadas.
									</p>
								</div>
							</div>


						</div>
					</main>
				</div>
				<div className="hidden h-14.5 lg:block"></div>
			</div>
		</>
	);
}
